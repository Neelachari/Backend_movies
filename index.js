const express=require("express")
const connection = require("./Config/db")
const signupRouter=require("./Routes/Signup.route")
const LoginRouter=require("./Routes/Login.route")
const movie=require("./Routes/movies.route")
const cors=require("cors")
const app=express()

app.use(express.json())

app.use(cors())

app.use("/users",signupRouter)

app.use("/users",LoginRouter)

app.use("/movies",movie)

require("dotenv").config()

app.get("/", (req,res)=>{
    res.send("Welcome to Movies")
})

app.listen(process.env.PORT, async()=>{
    try {
       await connection
       console.log("Server Running on Port", process.env.PORT) 
    } catch (error) {
        console.log(error)
    }
})