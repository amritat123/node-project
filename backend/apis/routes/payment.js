const express = require("express");
const router = express.Router();
const paymentController = require("../controller/payment");

router.get("/", paymentController.renderPaymentForm);
router.post("/charge", paymentController.handlePayment);

module.exports = router;
