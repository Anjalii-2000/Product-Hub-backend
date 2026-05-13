const express = require("express");

const {
    createUser,
    loginUser,
    logoutUser,
    getAllUser,
    deletedUser,
    getMe,
    updateProfile
} = require("../controller/UserController.js");

const Auth = require("../middleware/Auth.js");

const router = express.Router();

// PUBLIC ROUTES
router.post("/register", createUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

// PROTECTED ROUTES
router.get("/me", Auth, getMe);
router.put("/update-profile", Auth, updateProfile);

// OTHER ROUTES
router.get("/getUser", getAllUser);
router.delete("/delete", deletedUser);

module.exports = router;