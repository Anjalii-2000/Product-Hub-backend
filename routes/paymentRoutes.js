const express = require("express");
const router = express.Router();

const Auth = require("../middleware/Auth");

const { createCheckoutSession } = require("../controller/PaymentController");

router.post("/create-checkout-session", Auth, createCheckoutSession);

module.exports = router;