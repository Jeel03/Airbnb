const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError");
const passport = require("passport");
const { saveRedirectUrl,validateUser } = require("../middleware.js");
const userController = require("../controllers/users.js");


//signup page 
router.get("/signup", userController.renderSignupForm);

//signup page query request
// router.post("/signup", wrapAsync(userController.signup)); 
router.post("/signup", validateUser, wrapAsync(userController.signup));




//login page 
router.get("/login", userController.renderLoginForm);

//login post 
router.post("/login", saveRedirectUrl, userController.login);




// Logout route
router.get("/logout",userController.logout);

module.exports = router;