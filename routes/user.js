const express = require("express");
const { user } = require("../controllers");
const router = express.Router();
const { authVerify } = require("../middlewares/auth");

router.post("/signup", user.signup);
router.post("/otpVerification", user.verify);
router.post("/login", user.login);
router.post("/updateProfile", authVerify, user.updateProfile);
router.post("/forgotPassword",  user.forgotPassword);
router.post("/forgotPasswordVerification",  user.forgotPasswordVerification);
router.post("/resetPassword", authVerify, user.resetPassword);
router.post("/changePassword", authVerify, user.changePassword);
router.get("/getProfile", authVerify, user.getProfile);

module.exports = router;
