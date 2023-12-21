const mongoose =require('mongoose')

const signupSchema=mongoose.Schema({
    UserID:{type:Number,required:true},
    Name:{type:String,required:true},
    email:{type:String,required:true},
    mobile_Number:{type:Number,required:true},
    age:{type:Number,required:true},
    password:{type:String,required:true},
})

const SignupModel=mongoose.model('Movies_signup', signupSchema)

module.exports=SignupModel