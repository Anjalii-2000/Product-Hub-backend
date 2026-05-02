const Product = require("../models/productSchema.js");
const mongoose = require("mongoose");

async function createProduct(req, res) {
    try {
        const { productName, price, category, description } = req.body;

        if (!productName || !price || !category || !description) {
            return res.status(400).json({ message: "Fill all details" });
        }

        if (!req.file) {
            return res.status(400).json({ message: "Image is required" });
        }

        const userID = req.user.id;

        const productData = await Product.create({
            productName,
            price,
            category,
            description,
            image: req.file.filename,
            seller: userID
        });
        
        console.log(req.file, "request file");

        return res.status(201).json({
            message: "Product created",
            data: productData
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
}

async function getAllProduct(req, res) {
    try {
        const { category } = req.query;

        let filter = {};
        if (category) filter.category = category;

        const products = await Product.find(filter)
            .sort({ createdAt: -1 });

        return res.status(200).json({
            data: products,
            message: products.length === 0
                ? "No products found"
                : "Products fetched"
        });

    } catch (error) {
        return res.status(500).json({ message: "Server Error" });
    }
}

async function getSingleProduct(req, res) {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid product ID" });
        }

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        return res.status(200).json({
            data: product,
            message: "Product fetched successfully"
        });

    } catch (error) {
        return res.status(500).json({ message: "Server Error" });
    }
}

async function getSimilarProducts(req, res) {
    try {
        const { id } = req.params;

        const currentProduct = await Product.findById(id);

        if (!currentProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        const similarProducts = await Product.find({
            category: currentProduct.category,
            _id: { $ne: id }
        });

        return res.status(200).json({
            success: true,
            data: similarProducts
        });

    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
}

async function getMyProducts(req, res) {
    try {
        const sellerId = req.user.id;

        const products = await Product.find({ seller: sellerId })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Seller products fetched",
            data: products
        });

    } catch (error) {
        return res.status(500).json({ message: "Server Error" });
    }
}

module.exports = { createProduct, getAllProduct, getSingleProduct, getSimilarProducts, getMyProducts };