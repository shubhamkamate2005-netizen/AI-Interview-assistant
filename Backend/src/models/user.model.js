const mongoose=require('mongoose')

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        unique:true,
        required:[true,"Username is required"],
        trim:true,
        minlength:2,
        maxlength:50,
    },
    email:{
        type:String,
        unique:true,
        required:[true,"Email is required"],
        trim:true,
        lowercase:true,
        match:[/^\S+@\S+\.\S+$/,"Please provide a valid email address"],

    },
    password:{
        type:String,
        required:true
    }
})
const usermodel=mongoose.model("User",userSchema)
module.exports=usermodel
