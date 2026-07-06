const mongoose=require('mongoose')



const blacklistTokenSchema=new mongoose.Schema({
    token:{
        type:String,
        required:[true,"token is required to be added in blacklist"],
        unique:true
    },
    expiresAt:{
        type:Date,
        required:true,
        index:{expires:0}
    }
},
    {
        timestamps:true
    }
)

const tokenBlackListModel=mongoose.model("BlacklistToken",blacklistTokenSchema)
module.exports=tokenBlackListModel
