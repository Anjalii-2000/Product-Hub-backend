const Product = require("../models/productSchema.js");
const mongoose = require("mongoose");

async function createProduct(req, res) {
    try {

        console.log("req.body:", req.body);
        console.log("req.file:", req.file);

        // ADD THIS
        const { productName, price, category, description } = req.body;

        // VALIDATION
        if (
            !productName ||
            !price ||
            !category ||
            !description ||
            !req.file
        ) {
            return res.status(400).json({
                message: "Fill all details and upload image"
            });
        }

        const userID = req.user.id;

        console.log("Seller ID:", userID);

        // CREATE PRODUCT
        const productData = await Product.create({
            productName,
            price,
            category,
            description,
            image: `/uploads/${req.file.filename}`,

            seller: userID
        });

        console.log("Product created:", productData);

        return res.status(201).json({
            message: "Product created successfully",
            data: productData
        });

    } catch (error) {

        console.error("Error creating product:", error);

        return res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
}

async function getAllProduct(req, res) {
    try {
        const { category, searchTerm } = req.query;

        let filter = {};
        if (category) {
            filter.category = category;
        }

        if (searchTerm) {
            filter.$or = [
                {
                    productName: {
                        $regex: searchTerm,
                        $options: "i"
                    }
                },
                {
                    description: {
                        $regex: searchTerm,
                        $options: "i"
                    }
                }
            ];
        }
        const products = await Product.find(filter)
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            data: products,
            message: products.length === 0
                ? "No products found"
                : "Products fetched"
        });

    } catch (error) {
        console.error("Error fetching products:", error);
        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
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
        console.error("Error fetching single product:", error);
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
        console.error("Error fetching similar products:", error);
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
        console.error("Error fetching seller products:", error);
        return res.status(500).json({ message: "Server Error" });
    }
}



module.exports = { createProduct, getAllProduct, getSingleProduct, getSimilarProducts, getMyProducts };