const mongoose=require('mongoose');

/**
 * Job Description
 * resume text
 * self description
 * 
 * AI generates:
 * Technical questions:
 * [{  question:"",
 *      intention:"",
 *      answer:""
 * 
 *       }]
 * behavioral questions:
 *  [{  question:"",
 *      intention:"",
 *      answer:""
 * 
 *       }]
 * skill gaps:[{
 *       skill:"",
 *       severity:{
 *       type:string,
 *       }
 * }]
 * preparation plan:[{}]
 * - matchScore:Number
 */
const technicalQuestionsSchema=new mongoose.Schema({
    question:{
        type:String,
        required:[true,"technical question is required"]
    },
    intention:{
        type:String,
        required:[true,"intention is required"]
    },
    answer:{
        type:String,
        required:[true,"Answer is required"]
    }},{
        _id:false
    })

    const behavioralQuestionsSchema=new mongoose.Schema({
    question:{
        type:String,
        required:[true,"technical question is required"]
    },
    intention:{
        type:String,
        required:[true,"intention is required"]
    },
    answer:{
        type:String,
        required:[true,"Answer is required"]
    }},{
        _id:false
    })

    const skillGapSchema=new mongoose.Schema({
        skill:{
            type:String,
            required:[true,"skill is required"]
        },
        severity:{
            type:String,
            enum:["low","medium","high"],
            required:[true,"severity is required"]
        }},{
            _id:false
    })

    const preparationSchema=new mongoose.Schema({
        day:{
            type:Number,
            required:[true,"day is required"]
        },
        focus:{
            type:String,
            required:[true,"Focus is required"]
        },
        tasks:[{
            type:String,
            required:[true,"Task is required"]
        }]

    },{
        _id:false
    })



const interviewReportSchema=new mongoose.Schema({
    jobDescription:{
        type:String,
        required:[true,"Job description is required"]
    },
    resume:{
        type:String 
    },
    selfDescription:{
        type:String,
    },
    matchScore:{
        type:Number,
        min:0,
        max:100,
    },
    title:{
        type:String
    },
    technicalQuestions:[technicalQuestionsSchema],
    behavioralQuestions:{type:[behavioralQuestionsSchema],default:undefined},
    // Legacy field retained so older reports remain readable.
    behavioralQuestion:[behavioralQuestionsSchema],
    skillGaps:{type:[skillGapSchema],default:undefined},
    // Legacy field retained so older reports remain readable.
    skillgaps:[skillGapSchema],
    preparationPlan:[preparationSchema],
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    }
},{
    timestamps:true
})

const interviewReportModel=mongoose.model("InterviewReport",interviewReportSchema)
module.exports=interviewReportModel;
