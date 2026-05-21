require("dotenv").config();
console.log(process.env.SECRET_KEY);

const express = require("express");
const cors = require("cors");
const Stripe = require("stripe");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/user.route");
const productRouter = require("./routes/product.route");


const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const PORT = 3000;

// Database connection
mongoose.connect("mongodb://127.0.0.1:27017/mydb")
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log(err));

// Middleware
app.use(express.json());
app.use(cookieParser());

// CORS
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

// Routes
app.use("/api", userRouter);
app.use("/api", productRouter);

app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
    res.send("Hello server is running");
});

app.post("/create-payment-intent", async (req, res) => {
    const paymentIntent = await stripe.paymentIntents.create({
        amount: 1000 * 100,
        currency: "inr"
    });
    res.status(200).send({
        clientSecret: paymentIntent.client_secret,
    });
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});