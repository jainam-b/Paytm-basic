const express = require("express");
const router = express.Router();
router.use(express.json());
const zod = require("zod");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const { User, Account } = require("../db/db");
const { authmiddleware } = require("../middlewares/authmiddleware");

const signupBody = zod.object({
  username: zod.string().email(),
  firstName: zod.string(),
  lastName: zod.string(),
  password: zod.string().min(6),
});

router.post("/signup", async (req, res) => {
  const { success, data, error } = signupBody.safeParse(req.body);
  if (!success) {
    return res.status(400).json({
      message: "Invalid input data",
      error: error.issues,
    });
  }

  try {
    const existingUser = await User.findOne({ username: req.body.username });
    if (existingUser) {
      return res.status(409).json({
        message: "Email already taken",
      });
    }

    const user = await User.create({
      username: req.body.username,
      password: req.body.password,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    });
    const userId = user._id;

    await Account.create({
      userId,
      balance: 1 + Math.random() * 10000,
    });

    const token = jwt.sign({ userId }, JWT_SECRET);

    res.status(201).json({
      message: "User created successfully",
      token: token,
    });
  } catch (err) {
    if (err.code === 11000 && err.keyPattern.email) {
      // Duplicate key error for email field
      return res.status(400).json({
        message: "Email already taken",
      });
    }
    res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
});

const signinBody = zod.object({
  username: zod.string().email(),
  password: zod.string().min(6),
});

router.post("/signin", async (req, res) => {
  const { success, error } = signinBody.safeParse(req.body);
  if (!success) {
    return res.status(400).json({
      message: "Invalid input data",
      error: error.issues,
    });
  }

  const user = await User.findOne({
    username: req.body.username,
    password: req.body.password,
  });

  if (user) {
    const token = jwt.sign({ userId: user._id }, JWT_SECRET);

    res.json({
      token: token,
    });
    return;
  }

  res.status(401).json({
    message: "Invalid username or password",
  });
});

const updateBody = zod.object({
  password: zod.string().optional(),
  firstName: zod.string().optional(),
  lastName: zod.string().optional(),
});

router.put("/", authmiddleware, async (req, res) => {
  const { success, error } = updateBody.safeParse(req.body);
  if (!success) {
    return res.status(400).json({
      message: "Invalid input data",
      error: error.issues,
    });
  }

  await User.updateOne({ _id: req.userId }, req.body);

  res.json({
    message: "Updated successfully",
  });
});

router.get("/bulk", async (req, res) => {
  const filter = req.query.filter || "";

  const users = await User.find({
    $or: [
      { firstName: { $regex: filter, $options: "i" } },
      { lastName: { $regex: filter, $options: "i" } },
    ],
  });

  res.json({
    users: users.map(user => ({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      _id: user._id,
    })),
  });
});

module.exports = router;
