const stripe = require("../config/stripe");

// CREATE PAYMENT INTENT
const createPaymentIntent = async (req, res) => {
    try {
        const { amount } = req.body;

        console.log("Amount received from frontend:", amount);

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, // INR → paise
            currency: "inr",
            automatic_payment_methods: {
                enabled: true,
            },
        });

        console.log("Payment Intent Created:", paymentIntent.id);

        res.status(200).json({
            clientSecret: paymentIntent.client_secret,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createPaymentIntent };