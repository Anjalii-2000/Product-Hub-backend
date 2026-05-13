const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true,
    },

    slug: {
        type: String,
    },

    price: {
        type: String,
        required: true,
    },

    category: {
        type: String,
        required: true,
        enum: ["Electronics", "Clothing", "Food", "Books"],
    },

    description: {
        type: String,
        required: true,
    },

    image: {
        type: String,
        required: true,
    },

    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;