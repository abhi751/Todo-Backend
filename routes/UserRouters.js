const express= require("express")
const router = express.Router()
const User=require("../model/user")
const jwt= require("jsonwebtoken")
const bcrypt= require("bcrypt")
const saltRounds=10
const dontenv= require("dontenv").config();
const PRIVATE_KEY = process.env.PRIVATE_KEY|| "abhi@#345"

router.use(express.json())
router.use(express.urlencoded({
    extended:false
}))

router.post("/register",async (req,res)=>{
    try{
        const user=await User.findOne({
            email:req.body.email
        })
        if(user){
            return res.status(400).json({
                status:"Failed",
                message:"Account already exist!"
            })
        }
        //password hashing
        const hashed_password=await bcrypt.hash(req.body.password,saltRounds);
        const chashed_password=await bcrypt.hash( req.body.confirmPassword,saltRounds);
        const new_user={
            email:req.body.email,
            password:hashed_password,
            confirmPassword:chashed_password,
        }
        //new user in database
        const response=await User.create(new_user);
        res.status(201).json({
            status:"Success",
            message:"Registration Successfull",
        })
    }catch(err){
        res.status(500).json({
            status:"Failed",
            message:err.message,
        })
    }
})

//login

router.post("/login",async (req,res)=>{
    try{
        const {email,password}=req.body
        //checking if email is present or not
        const user= await User.findOne({
            email:email
        });
        //If email is not present 
        if(!user){
            return res.status(404).json({
                status:"Failed",
                message:"Please type the correct email"
            })
        }
        //if the user idenfied then compare the password
        const response=bcrypt.compare(password,user.password)

        //if the password matches then allowvthe user to login and generate token
        if(response){
            const token = jwt.sign(
                {data:user.email},PRIVATE_KEY,{expiresIn:"1h"}
            )
            return res.json({
                status:"Success",
                message:"token generted",
                token:token,
                email:user.email
            })    
        }else{
            res.status(401).json({
                status:"Failed",
                message:"Invalid Credentials"
            })
        }
    }catch(err){
        res.status(500).json({
            status:"Failed",
            message:err.message
        })
    }
})

module.exports=router;