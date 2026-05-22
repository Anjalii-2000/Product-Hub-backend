const express = require("express");

const { createProduct, getAllProduct, getSingleProduct, getSimilarProducts, getMyProducts, deleteProduct } = require("../controller/ProductController.js");

const Auth = require("../middleware/Auth.js");
const RoleAuth = require("../middleware/RoleAuth.js");
const upload = require("../middleware/upload.js");

const router = express.Router();

// CREATE PRODUCT
router.post(
    "/create-product",
    Auth,
    RoleAuth("seller"),
    upload.single("image"),
    createProduct
);

// GET ALL PRODUCTS
router.get("/getallproduct", getAllProduct);

// GET SINGLE PRODUCT
router.get("/getproduct/:id", getSingleProduct);

// GET SIMILAR PRODUCTS
router.get("/similar-products/:id", getSimilarProducts);

// GET SELLER PRODUCTS
router.get("/my-product", Auth, getMyProducts);

// DELETE SELLER PRODUCT
router.delete("/delete-product/:id", Auth, deleteProduct);

module.exports = router;