require("dotenv").config();
console.log("JWT Secret:", process.env.SECRET_KEY);

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const userRouter = require("./routes/user.route");
const productRouter = require("./routes/product.route");
const paymentRouter = require("./routes/paymentRoutes");

const app = express();
const PORT = 3000;

// DB
mongoose.connect("mongodb://127.0.0.1:27017/mydb")
  .then(() => console.log("MongoDB connected"))
  .catch(console.log);


app.use(express.json());
// CORS
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));


app.use(cookieParser());

// Routes
app.use("/api", userRouter);
app.use("/api", productRouter);
app.use("/api/payment", paymentRouter);

app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("Server running");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});