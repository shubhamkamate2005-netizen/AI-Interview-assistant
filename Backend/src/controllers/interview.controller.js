const { PDFParse } = require('pdf-parse')
const mongoose = require('mongoose')
const { generateInterviewReport } = require('../services/ai.service')
const interviewReportModel = require('../models/interviewReport.model')

async function generateInterviewReportController(req, res) {
    try {
        let resumeText = "";
        if (req.file) {
            const parser = new PDFParse({ data: req.file.buffer })
            try {
                const resumeContent = await parser.getText()
                resumeText = resumeContent.text.trim()
            } finally {
                await parser.destroy()
            }
        }

        const selfDescription = req.body.selfDescription?.trim() || ""
        const jobDescription = req.body.jobDescription?.trim() || ""

        if (!jobDescription) {
            return res.status(400).json({
                message: "Job description is required"
            })
        }

        if (!resumeText && !selfDescription) {
            return res.status(400).json({
                message: "Either a Resume PDF or a Self Description is required"
            })
        }

        const interviewReportByAi = await generateInterviewReport({
            resume: resumeText || "Not provided",
            selfDescription: selfDescription || "Not provided",
            jobDescription
        })

        const interviewReport = await interviewReportModel.create({
            jobDescription,
            resume: resumeText,
            selfDescription,
            user: req.user.id,
            matchScore: interviewReportByAi.matchScore,
            title: interviewReportByAi.title,
            technicalQuestions: interviewReportByAi.technicalQuestions,
            behavioralQuestions: interviewReportByAi.behavioralQuestions,
            skillGaps: interviewReportByAi.skillGaps,
            preparationPlan: interviewReportByAi.preparationPlan
        })

        res.status(201).json({
            message: "Interview report generated successfully",
            interviewReport
        })
    }
    catch (error) {
        const errorMessage = error.message || ""
        const isAiUnavailable = errorMessage.includes('"code":503') || errorMessage.includes("UNAVAILABLE")

        if (isAiUnavailable) {
            return res.status(503).json({
                message: "AI service is currently busy. Please try again in a few seconds."
            })
        }

        if (errorMessage.includes("AI returned an invalid interview report")) {
            return res.status(502).json({
                message: "AI did not return the expected interview report format. Please try again.",
                error: errorMessage
            })
        }

        return res.status(500).json({
            message: "Failed to generate interview report",
            error: errorMessage
        })
    }
}

async function getInterviewReportsController(req, res) {
    try {
        const reports = await interviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 })
        res.status(200).json({
            message: "Interview reports fetched successfully",
            reports
        })
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch interview reports",
            error: error.message
        })
    }
}

async function getInterviewReportByIdController(req, res) {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "Invalid interview report ID" })
        }
        const report = await interviewReportModel.findOne({ _id: req.params.id, user: req.user.id })
        if (!report) {
            return res.status(404).json({
                message: "Interview report not found"
            })
        }
        res.status(200).json({
            message: "Interview report fetched successfully",
            report
        })
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch interview report",
            error: error.message
        })
    }
}

module.exports = {
    generateInterviewReportController,
    getInterviewReportsController,
    getInterviewReportByIdController
}
