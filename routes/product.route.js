const express = require("express")
const { createProduct, getAllProduct, getSingleProduct, getSimilarProducts, getMyProducts } = require("../controller/ProductController.js")
const Auth = require("../middleware/Auth.js")
const RoleAuth = require("../middleware/RoleAuth.js")
const router = express.Router()


router.post('/create-product', Auth, RoleAuth("seller"), createProduct)
router.get('/getallproduct', getAllProduct)
router.get('/getproduct/:id', getSingleProduct)
router.get("/similar-products/:id", getSimilarProducts)
router.get("/my-product", Auth, getMyProducts);
module.exports = router;