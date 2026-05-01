const Product = require("../models/productSchema.js");
const mongoose = require("mongoose");


async function createProduct(req, res) {
    try {
        const { productName, price, category, description, image } = req.body;

        if (!productName || !price || !category || !description || !image) {
            return res.status(400).json({ message: "Fill all details" });
        }

        const userID = req.user.id;

        const productData = await Product.create({
            productName,
            price,
            category,
            description,
            image,
            seller: userID
        });

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


// GET ALL PRODUCTS
async function getAllProduct(req, res) {
    try {
        const { category } = req.query;

        let filter = {};
        if (category) {
            filter.category = category;
        }

        const products = await Product.find(filter);

        return res.status(200).json({
            data: products,
            message: products.length === 0
                ? "No products found"
                : category
                    ? `Products fetched for category: ${category}`
                    : "All products fetched"
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
}


// GET SINGLE PRODUCT
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
        return res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
}


// GET SIMILAR PRODUCTS
const getSimilarProducts = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid product ID" });
        }

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
};


// GET MY PRODUCTS
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
        return res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
}




module.exports = { createProduct, getAllProduct, getSingleProduct, getSimilarProducts, getMyProducts };