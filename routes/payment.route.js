const express = require("express");
const router = express.Router();

const { createPaymentIntent } = require("../controller/paymentControlller");

// POST /api/payment/create-payment-intent
router.post("/create-payment-intent", createPaymentIntent);

module.exports = router;