const userModel=require("../models/user.model")
const bcrypt=require('bcryptjs')
const jwt=require("jsonwebtoken")
const tokenBlackListModel=require("../models/blacklist.model")

const cookieOptions={
    httpOnly:true,
    sameSite:process.env.NODE_ENV==="production"?"none":"lax",
    secure:process.env.NODE_ENV==="production",
    maxAge:24*60*60*1000
}

function createToken(user){
    if(!process.env.JWT_SECRET_KEY) throw new Error("JWT_SECRET_KEY is not configured")
    return jwt.sign({id:user._id,username:user.username},process.env.JWT_SECRET_KEY,{expiresIn:"1d"})
}

function publicUser(user){
    return {id:user._id,username:user.username,email:user.email}
}
/**
 * @name registerusercontroller
 * @route Post /api/auth/register 
 * @description register new user 
 */

async function registerUserController(req,res,next){
  try{
    const username=typeof req.body.username==="string"?req.body.username.trim():""
    const {password}=req.body
    const email=typeof req.body.email==="string"?req.body.email.trim().toLowerCase():""

    if(!username||!email||typeof password!=="string"){
        return res.status(400).json({
            message:"Please provide username,email and password"
        })
    }
    if(username.length<2){
        return res.status(400).json({message:"Username must contain at least 2 characters"})
    }
    if(username.length>50){
        return res.status(400).json({message:"Username must contain no more than 50 characters"})
    }
    if(!/^\S+@\S+\.\S+$/.test(email)){
        return res.status(400).json({message:"Please provide a valid email address"})
    }
    if(password.length<8){
        return res.status(400).json({message:"Password must contain at least 8 characters"})
    }
    if(Buffer.byteLength(password,"utf8")>72){
        return res.status(400).json({message:"Password must contain no more than 72 bytes"})
    }
    const isUserAlredyExists=await userModel.findOne({
        $or:[{username},{email}] 
        /*above condition helps to find the username,
        or email any one if exists that condition finding it helps */
    })
    if(isUserAlredyExists){
        /* isUserAlreadyExists of username and email */
        return res.status(409).json({
            message:"An account with that username or email already exists"
        })
    }

    /*In the below code we are doing paasword hashing using bcryptjs hash method */
    const hash=await bcrypt.hash(password,12)
/*if user not exists means we are creating new user below code */
    const user=await userModel.create({
        username,
        email,
        password:hash
    })
    /*here we are createing JWT Token for that we need JWT secreate KEY 
    * below code is to create token for the each user who register*/
   const token=createToken(user)

   /**
    * IN below code we are setting token into the cookies
    * after setting into cookie it gives response method
    */
   res.cookie("token",token,cookieOptions)
   res.status(201).json({
    message:"User registered successfully",
    user:publicUser(user)
   })
  }catch(error){
    if(error.code===11000) return res.status(409).json({message:"An account with those details already exists"})
    if(error.name==="ValidationError") return res.status(400).json({message:error.message})
    next(error)
  }
}


/**
 * @name loginusercontroller
 * @route Post /api/auth/login 
 * @description login user 
 */
async function loginUserController(req,res,next){
  try{
    const {password}=req.body
    const email=req.body.email && req.body.email.trim().toLowerCase()

    if(!email||!password){
        return res.status(400).json({
            message:"Please provide email and password"
        })
    }

    /**
     * we check wheather email and password exist or not
     */
    const user=await userModel.findOne({email})
    if(!user){
        return res.status(401).json({
            message:"Invalid email or password"
        })
    }
    const ispasswordvalid=await bcrypt.compare(password,user.password)
    if(!ispasswordvalid){
        return res.status(401).json({
            message:"Invalid email or password"
        })
    }

   const token=createToken(user)
   res.cookie("token",token,cookieOptions)
   res.status(200).json({
    message:"user logged successfully",
    user:publicUser(user)
   })
  }catch(error){next(error)}
}

async function logoutUserController(req, res, next) {
  try{
    const authHeader=req.headers.authorization
    const token = req.cookies.token || (authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null)

    if (token) {
        const decoded=jwt.decode(token)
        const expiresAt=decoded?.exp?new Date(decoded.exp*1000):new Date(Date.now()+86400000)
        await tokenBlackListModel.updateOne({token},{token,expiresAt},{upsert:true})
    }

    res.clearCookie("token",cookieOptions)

    res.status(200).json({
        message: "User logged out successfully"
    })
  }catch(error){next(error)}
}

async function getMeController(req,res,next){
  try{
        const user=await userModel.findById(req.user.id)
        if(!user) return res.status(401).json({message:"User no longer exists"})

        
        res.status(200).json({
            message: "User data fetched successfully",
            user:publicUser(user)

        })
  }catch(error){next(error)}
    }


module.exports={
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController
}
