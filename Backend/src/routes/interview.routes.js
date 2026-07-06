const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const interviewController = require('../controllers/interview.controller');
const upload = require('../middleware/file.middleware')
const interviewRouter = express.Router();

/**
 * @route POST /api/interview
 * @access Private
 * @description generate new interview report on the basis of user input and save it to database
 */
interviewRouter.post("/", authMiddleware.authuser, upload.single("resume"), interviewController.generateInterviewReportController)

/**
 * @route GET /api/interview
 * @access Private
 * @description get all interview reports for the logged in user
 */
interviewRouter.get("/", authMiddleware.authuser, interviewController.getInterviewReportsController)

/**
 * @route GET /api/interview/:id
 * @access Private
 * @description get a specific interview report by ID for the logged in user
 */
interviewRouter.get("/:id", authMiddleware.authuser, interviewController.getInterviewReportByIdController)

module.exports = interviewRouter;
