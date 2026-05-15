const User = require("../models/userSchema.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function createUser(req, res) {
    try {

        const { firstName, email, password, phone, role } = req.body;
    
        if (!firstName || !email || !password || !phone || !role) {
            return res.status(400).send({
                message: "All fields are required"
            });
        }

        const isUserExisted = await User.findOne({ email });

        if (isUserExisted) {
            return res.status(400).send({
                message: "User already existed"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const userData = await User.create({
            firstName,
            email,
            password: hashedPassword,
            phone,
            role
        });

        // JWT TOKEN
        const token = jwt.sign(
            {
                id: userData._id,
                email: userData.email,
                role: userData.role
            },
            process.env.SECRET_KEY,
            {
                expiresIn: "7d"
            }
        );

        // STORE TOKEN IN COOKIE
        res.cookie("token", token, {
            httpOnly: true,
            secure: false, // true in production
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
 
        return res.status(201).send({
            message: "User created successfully",
            user: {
                firstName: userData.firstName,
                email: userData.email,
                phone: userData.phone,
                role: userData.role
            }
        });

    } catch (error) {

        return res.status(500).send({
            message: "Error creating user",
            error: error.message
        });
    }
}

async function loginUser(req, res) {

    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).send({
                message: "Email and password required"
            });
        }

        const isUserExisted = await User.findOne({ email });

        if (!isUserExisted) {
            return res.status(404).send({
                message: "User not found"
            });
        }

        const comparePassword = await bcrypt.compare(
            password,
            isUserExisted.password
        );

        if (!comparePassword) {
            return res.status(400).send({
                message: "Password not matched"
            });
        }

        // JWT TOKEN
        const token = jwt.sign(
            {
                id: isUserExisted._id,
                email: isUserExisted.email,
                role: isUserExisted.role
            },
            process.env.SECRET_KEY,
            {
                expiresIn: "1d"
            }
        );

        // STORE TOKEN IN COOKIE
        res.cookie("token", token, {
            httpOnly: true,
            secure: false, // true in production
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000
        });

        return res.status(200).send({
            message: "Login successful",
            user: {
                firstName: isUserExisted.firstName,
                email: isUserExisted.email,
                phone: isUserExisted.phone,
                role: isUserExisted.role
            }
        });

    } catch (error) {

        return res.status(500).send({
            message: "Server Error",
            error: error.message
        });
    }
}

async function logoutUser(req, res) {

    try {

        res.clearCookie("token", {
            httpOnly: true,
            secure: false,
            sameSite: "lax"
        });

        return res.status(200).send({
            message: "Logout successful"
        });

    } catch (error) {

        return res.status(500).send({
            message: "Server Error",
            error: error.message
        });
    }
}

async function getAllUser(req, res) {

    try {

        const getUser = await User.find().select("-password");

        return res.status(200).send({
            message: "All users fetched",
            data: getUser
        });

    } catch (error) {

        return res.status(500).send({
            message: "Server Error",
            error: error.message
        });
    }
}

async function deletedUser(req, res) {

    try {

        const { email } = req.body;

        const result = await User.deleteOne({ email });

        if (result.deletedCount === 0) {
            return res.status(404).send({
                message: "User not found"
            });
        }

        return res.status(200).send({
            message: "Deleted Successfully"
        });

    } catch (error) {

        return res.status(500).send({
            message: "Server Error",
            error: error.message
        });
    }
}

async function getMe(req, res) {

    try {

        const userId = req.user.id;

        const user = await User.findById(userId).select("-password");

        if (!user) {
            return res.status(404).send({
                message: "User not found"
            });
        }

        return res.status(200).send({
            message: "User profile fetched successfully",
            user
        });

    } catch (error) {

        return res.status(500).send({
            message: "Server error",
            error: error.message
        });
    }
}

async function updateProfile(req, res) {

    try {

        const userId = req.user.id;

        const { name, password, confirmPassword, phone } = req.body;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).send({
                message: "User not found"
            });
        }

        if (password && password !== confirmPassword) {
            return res.status(400).send({
                message: "Passwords do not match"
            });
        }

        if (name) {
            user.firstName = name;
        }

        if (phone && phone !== user.phone) {

            const existingPhone = await User.findOne({ phone });

            if (existingPhone) {
                return res.status(400).send({
                    message: "Phone number already in use"
                });
            }

            user.phone = phone;
        }

        if (password && password.trim() !== "") {

            const hashedPassword = await bcrypt.hash(password, 10);

            user.password = hashedPassword;
        }

        await user.save();

        return res.status(200).send({
            message: "Profile updated successfully",
            user: {
                firstName: user.firstName,
                email: user.email,
                phone: user.phone,
                role: user.role
            }
        });

    } catch (error) {

        return res.status(500).send({
            message: "Server Error",
            error: error.message
        });
    }
}

module.exports = {
    createUser,
    loginUser,
    logoutUser,
    getAllUser,
    deletedUser,
    getMe,
    updateProfile
};