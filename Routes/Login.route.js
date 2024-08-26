const express=require("express")

const bcrypt=require("bcrypt")

const JWT=require("jsonwebtoken")

require("dotenv").config()


const RegisterModel=require("../Model/Signup.model")

const LoginRouter=express.Router()

LoginRouter.post("/login", async(req,res)=>{
    const {email, password}=req.body
   try {
    const User=await RegisterModel.findOne({email})
    let verify=await bcrypt.compare(password,User.password)
    if(verify){
        const token= await JWT.sign({userId:User._id},process.env.key)
        res.status(200).send({message:"Login Successful...",UserId:User._id,Account_info:User.Account_info,token})
    }
   } catch (error) {
       res.status(400).send({message:"Email not Found please SignUp to continue"})
   }
})

// LoginRouter.get("/logout", async()=>{
//     try {
//         const token=req.headers.authorization?.split(" ")[1]|| null
//         if(token){
//             await BlackListModel.updateMany({},{$push:{blacllist:[token]}})
//             res.status(200).send("User has been logged out")
//         }
//     } catch (error) {
//         res.status(400).send({error:err.message})
//     }

// })

module.exports=LoginRouter