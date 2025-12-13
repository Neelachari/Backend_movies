const JWT=require("jsonwebtoken")

require("dotenv").config()

const auth= async(req,res, next)=>{
    if(!req.headers.authorization){
        return res.status(400).send({error:"Authorization header missing"})
    }
    let token;
    const authHeader = req.headers.authorization;
    if(authHeader.startsWith("Bearer ")){
        token = authHeader.split(" ")[1];
    } else {
        token = authHeader;
    }
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