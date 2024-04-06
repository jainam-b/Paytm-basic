const express=require("express")
const router=express.Router();
router.use(express.json());
router.get("/user",(req,res)=>{
    res.json({
        msg:"in user.js"
    })
}
)


router.post("/signup",(req,res)=>{
    const {username,firstname,lastname,password}=req.body
    console.log({username});

    res.json({
        meg:"succes"
    })
     

})

module.exports=router