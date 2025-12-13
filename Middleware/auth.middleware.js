const JWT=require("jsonwebtoken")

require("dotenv").config()

const auth= async(req,res, next)=>{
    if(!req.headers.authorization){
        return res.status(400).send({error:"Authorization header missing"})
    }
    const token =req.headers.authorization.split(" ")[1]
    if(!token){
        return res.status(400).send({error:"Token missing"})
    }
    try {
       const decode=JWT.verify(token, process.env.key)
       req.body.userID=decode.userID
       next()
    } catch (error) {
        res.status(400).send({error:error.message})
    }
}

module.exports={auth}