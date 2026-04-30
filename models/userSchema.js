const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        
        },
        password: {
            type: String,
            required: true,
            minlength: 6
        },
        phone: {
            type: String,
            required: true,
            unique: true
        },

        isVerified: {
            type: Boolean,
            default: false
        },
   role:{
            type: String,
            enum : ['seller', 'customer'],
            required: true

        },
        createdAt: {
            type: Date,
            default: Date.now
        },
     
    });

const User = mongoose.model("User", userSchema);

module.exports = User;