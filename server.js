require("dotenv").config();
console.log(process.env.SECRET_KEY);

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/user.route");
const productRouter = require("./routes/product.route");

const app = express();
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
        origin: "http://localhost:5173", // frontend URL
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

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});