const express=require('express')
const app=express()
const authrouter=require('./routes/auth.routes')
const cookieParser = require('cookie-parser')
const cors=require("cors")
const multer=require("multer")
app.use(express.json())
app.use(cookieParser())

const allowedOrigins=[
    process.env.FRONTEND_URL,
    "http://localhost:5173",
    "http://127.0.0.1:5173"
].filter(Boolean)

function isAllowedOrigin(origin){
    if(!origin||allowedOrigins.includes(origin)) return true

    if(process.env.NODE_ENV!=="production"){
        try{
            const url=new URL(origin)
            return (url.hostname==="localhost"||url.hostname==="127.0.0.1")&&
                (url.protocol==="http:"||url.protocol==="https:")
        }catch{
            return false
        }
    }

    return false
}

app.use(cors({
    origin(origin,callback){
        if(isAllowedOrigin(origin)){
            return callback(null,true)
        }
        return callback(new Error("Not allowed by CORS"))
    },
    credentials:true
}))
app.use("/api/auth",authrouter)

const interviewRouter=require('./routes/interview.routes')
app.use("/api/interview",interviewRouter)

app.get("/api/health",(req,res)=>res.status(200).json({status:"ok"}))

app.use((err,req,res,next)=>{
    if(err instanceof multer.MulterError){
        const message=err.code==="LIMIT_FILE_SIZE"
            ? "Resume must be smaller than 5MB"
            : "Only PDF resume files are supported"
        return res.status(400).json({message})
    }
    console.error(err)
    return res.status(500).json({
        message:process.env.NODE_ENV==="production"
            ? "Something went wrong"
            : err.message||"Something went wrong"
    })
})

module.exports=app
