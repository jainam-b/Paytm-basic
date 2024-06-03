const express = require("express");
const router = express.Router();
router.use(express.json());
const zod = require("zod");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const { User,Account } = require("../db/db");
const { authmiddleware } = require("../middlewares/authmiddleware");
const signupBody = zod.object({
  email: zod.string().email(),
  firstname: zod.string(),
  lastname: zod.string(),
  password: zod.string().min(8),
});

router.post("/signup", async (req, res) => {
  const { success } = signupBody.safeParse(req.body);
  console.log(signupBody.safeParse(req.body));
  // const {email,firstname,lastname,password}=req.body

  if (!success) {
    return res.status(411).json({
      message: "Email already taken/Incorrect inputs",
    });
  }
  const existingUser = await User.findOne({
    email: req.body.email,
  });
  if (existingUser) {
    res.status(411).json({
      message: "Email already taken",
    });
  }

  const user = await User.create({
    email: req.body.email,
    firstName: req.body.firstname,
    lastname: req.body.lastname,
    password: req.body.password,
  });
  const userId = user._id;
await Account.create({
    userId,
    balance: 1+Math.random()*1000
})
  const token = jwt.sign(
    {
      userId,
    },
    JWT_SECRET
  );
  res.json({
    message: "User created successfully",
    token: token,
  });
});

// route to update the info of users
const updateBody = zod.object({
  password: zod.string().min(8).optional(),
  firstName: zod.string().optional(),
  lastName: zod.string().optional(),
});
router.put("/update", authmiddleware, async (req, res) => {

    const {success}=updateBody.safeParse(req.body);
    if(!success){
        res.status(403).json({
            msg:"Please enter correct info"
        })

    }
  await User.updateOne({ _id: req.userId }, req.body);
  res.json({
    msg: "User updated success",
  });
});

// route to get user using filter 
router.get("/user/bulk",async(req,res)=>{
    const filter =req.query.filter  ;
    const users=await User.find({
        $or:[{
            firstName:{
                "$regex":filter
            }
        },{
            lastname:{
                "$regex":filter
            }
        }]
    });
    // console.log(users);
    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastname: user.lastname,
            _id: user._id
        })) 
    })

});

module.exports = router;
