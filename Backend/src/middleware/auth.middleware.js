const jwt=require('jsonwebtoken')
const tokenBlackListModel=require("../models/blacklist.model")

async function authuser(req,res,next){
  try{
    const authHeader=req.headers.authorization
    const token=req.cookies.token || (authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null)

    if(!token){
        return res.status(401).json({
            message:"Token not provided"
        })
    }
    const isTokenBlackListed=await tokenBlackListModel.exists({token})
    if(isTokenBlackListed){
        return res.status(401).json({
            message:"token is invalid"
        })
    }
   const decoded= jwt.verify(token,process.env.JWT_SECRET_KEY)
   req.user=decoded
   next()
    }
    catch(err){
        if(err.name!=="JsonWebTokenError"&&err.name!=="TokenExpiredError") return next(err)
        return res.status(401).json({
            message:"Your session is invalid or expired"
        })
    }
}

module.exports={authuser}
