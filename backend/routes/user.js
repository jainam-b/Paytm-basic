const express=require("express")
const router=express.Router();

router.get("/user",(req,res)=>{
    res.json({
        msg:"in user.js"
    })
})

module.exports=router