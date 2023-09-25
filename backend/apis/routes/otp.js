// routes/otpRoutes.js
const express = require("express");
const otpController = require("../controller/otp");

const router = express.Router();

// Define a route for sending OTP
router.post("/send-otp", otpController.sendEmail);

module.exports = router;
