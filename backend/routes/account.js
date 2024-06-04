const express=require("express");
const { authmiddleware } = require("../middlewares/authmiddleware");
const { Account } = require("../db/db");
const router = express.Router();
router.use(express.json());


// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjVkYmZiM2Q3M2Q1M2YyZDYxYzc0YTYiLCJpYXQiOjE3MTc0MTk5NTV9.35a1kbFU5GYThijIziOpYXMOnUnTgZ-odrY3qttBaeI

router.get("/account/balance",authmiddleware,async(req,res)=>{
    const userId=req.userId

    const account= await Account.findOne({_id:userId});

    res.json({
        balance:account.balance
    })
})


module.exports = router;