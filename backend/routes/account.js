const express = require("express");
const { authmiddleware } = require("../middlewares/authmiddleware");
const { Account } = require("../db/db");
const router = express.Router();
router.use(express.json());
const { default: mongoose } = require('mongoose');

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjVmM2FmYjAyYmNjMGJmNzEwZDQ2MTMiLCJpYXQiOjE3MTc1MTcwNTF9.g38Wj_qyjTlVTYGo1J8ryww_9iFf6pwod5LFIB-DVEA
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjVmM2QyZWU5NDBhZGNhNzk1MGUyZTUiLCJpYXQiOjE3MTc1MTc2MTR9.AlfVr6eR0VLAU23Wie3l_Bt8BAXeui5eNS7z88p2hlk
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjVmM2Q2NDRlNTQzYjc0ZTE4MzViMmIiLCJpYXQiOjE3MTc1MTc2Njh9.afh2Obg53c4yC6TdybCYjMlYL2QWQAGkE8D3BPhA_TU
router.get("/account/balance", authmiddleware, async (req, res) => {
  const userId = req.userId;
  console.log(userId);
  const account = await Account.findOne({ userId: userId });
  console.log(account);
  res.json({
    balance: account.balance,
  });
});

//  route to transfer funds

router.post("/transfer", authmiddleware, async (req, res) => {
    const session = await mongoose.startSession();
  session.startTransaction();

  const { amount, to } = req.body;

  // Fetch account details of the sender
  const account = await Account.findOne({ userId: req.userId }).session(
    session
  );

  if (!account || account.balance < amount) {
    await session.abortTransaction();
    return res.status(400).json({
      message: "Insufficient balance ",
    });
  }

  const toAccount = await Account.findOne({ userId: to }).session(session);

  if (!toAccount) {
    await session.abortTransaction();
    return res.status(400).json({
      message: "Insufficient balance ",
    });
  }

  await Account.updateOne(
    { userId: req.userId },
    { $inc: { balance: -amount } }
  ).session(session);
  await Account.updateOne(
    { userId: to },
    { $inc: { balance: amount } }
  ).session(session);

  await session.commitTransaction();
  res.json({
    message: "Transfer Success",
  });
});

module.exports = router;
