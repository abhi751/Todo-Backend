const express= require("express")
const router = express.Router()
const TodoList=require("../model/Todo")
const jwt= require("jsonwebtoken")
const PRIVATE_KEY = process.env.PRIVATE_KEY|| "abhi@#345"
const tokenAuth=(req,res,next)=>{
    const token=req.headers.authorization;
    if(!token){
        return res.status(400).json({
            status:"Failed",
            message:"Token missing"
        })
    }
    try{
        const response=jwt.verify(token,PRIVATE_KEY,(err,decode)=>{
            if(err){
                return res.status(403).json({
                    status:"Failed",
                    message:"Not a valid token"
                })
            }
            req.loggedIn_email=decoded.data;
            next()
        })
    }catch(err){
        return res.status(401).json({
            status:"Failed",
            message:"Internal server error"
        })
    }
}

router.get("/",tokenAuth,async(req,res)=>{
    try{
        const todos=await TodoList.find({
            email:req.loggedIn_email
        })
        res.status(200).json({
            status:"Success",
            todos
        })
    }catch(err){
        res.status(400).json({
            status:"Failed",
            message:err.message
        })
    }
})
//Method to post the data
router.post("/",tokenAuth,async(req,res)=>{
    try{
        req.body.email=req.loggedIn_email;
        const todos=await TodoList.create(req.body);
        res.json({
            status:"Success",
            todos
        })
    }catch(err){
        res.status(400).json({
            status:"Failed",
            message:err.message
        })
    }
})

//Method to update the data

router.put("/:todo_id",tokenAuth,async(req,res)=>{
    try{
        const data= await TodoList.findOne({
            order_id:req.params.order_id
        })
        //same email or not
        if(data.email!==req.loggedIn_email){
            return res.status(401).json({
                status:"Failed",
                message:"Not Authorized",
            })
        }
        const todos= await TodoList.updateOne({todoId:req.params.todo_id},updateData)
        res.json({
            status:"Success",
            todos,
        })
    }
    catch(err){
        res.status(400).json({
            status:"Failed",
            message:err.message,
        })
    }
})

//delete data
router.delete("/",tokenAuth,async(req,res)=>{
    try{
        const data=await TodoList.findOne({
            id:req.params.id
        })
        if(data.email!==req.loggedIn_email){
            return res.status(401).json({
                status:"Failed",
                message:"Not Authorized",
            })
        }
    }catch(err){
        res.status(400).json({
            status:"Failed",
            message:err.message,
        })
    }
})

router.use("*",(req,res)=>{
    res.status(500).send("Invalid Url")
})
 
module.exports=router;