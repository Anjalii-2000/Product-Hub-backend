require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
import cookieParser from "cookie-parser";


const userRouter = require("./routes/user.route");
const productRouter = require("./routes/product.route");
// const wishlistRouter = require("./routes/wishlist.route");
const app = express();
const PORT = 3000;


mongoose.connect("mongodb://127.0.0.1:27017/mydb")
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));

app.use(cors({ origin: "*" }));
app.use(express.json());

app.use(cookieParser());
app.use("/api", userRouter, productRouter);
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
    res.send("hello server is running");
});

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});