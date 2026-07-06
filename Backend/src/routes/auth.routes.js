const express=require('express')
const authrouter=express.Router()
const authController=require("../controllers/auth.controller")
const authmidddleware=require("../middleware/auth.middleware")
/**
 * @route POST/api/auth/register
 * @description Register user 
 * @access Public
*/
authrouter.post("/register",authController.registerUserController)

/**
 * @route POST/api/auth/login
 * @description login user with email and password 
 * @access Public
*/
authrouter.post("/login",authController.loginUserController)

/**
 * For logout purpose we are using blacklisting
 * @route GET /api/auth/logout
 * @description logout user clear cookie add token in the blacklist
 * @access public
 */
authrouter.post("/logout",authController.logoutUserController)
/**
 * @route GET /api/auth/get-me
 * @description get the current logged in user
 * @api private
 */
authrouter.get("/get-me",authmidddleware.authuser,authController.getMeController)


module.exports=authrouter 
