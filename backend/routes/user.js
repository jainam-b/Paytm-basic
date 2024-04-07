const express=require("express")
const router=express.Router();
router.use(express.json());
const zod =require("zod");
const jwt=require("jsonwebtoken");
const {JWT_SECRET}=require("../config");
const {User}=require("../db/db")

const signupBody=zod.object({
    email:zod.string() ,
    firstname: zod.string(),
    lastname: zod.string(),
    password:zod.string().min(8)
})

router.post("/signup",async(req,res)=>{

    const {success}=signupBody.safeParse(req.body);
    console.log(signupBody.safeParse(req.body));
    // const {email,firstname,lastname,password}=req.body

    if(!success){
      return  res.status(411).json({
        message:"Email already taken/Incorrect inputs"
      });
    };
    const existingUser= await User.findOne({
        email:req.body.email
    })
    if(existingUser){
        res.status(411).json({
            message:"Email already taken"
        })
    }

    const user=await User.create({
        email:req.body.email,
        firstName:req.body.firstname,
        lastname:req.body.lastname,
        password:req.body.password,


    })
     const userId = user._id;

    const token = jwt.sign({
        userId
    }, JWT_SECRET);
     res.json({
        message: "User created successfully",
        token: token
    })
     

})

module.exports=router