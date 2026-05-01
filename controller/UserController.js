const User = require("../models/userSchema.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function createUser(req, res) {
     try {
          console.log(req.body);

          const { firstName, email, password, phone, role } = req.body;

          if (!firstName || !email || !password || !phone) {
               return res.status(400).send("All fields are required ")

          }

          const isUserExisted = await User.findOne({ email }) // []
          if (isUserExisted) {

               return res.status(400).send(
                    {
                         message: "User already existed",
                         data: []
                    }
               )

          }
          const hashedPasword = await bcrypt.hash(password, 10)

          const userData = await User.create({
               firstName,
               email,
               password: hashedPasword,
               phone,
               role
          });

          //create a token
          const token = jwt.sign(
               { id: userData._id, email: userData.email, role: role },
               process.env.SECRET_KEY,
               { expiresIn: "7d" }
          )
          // send response 
          res.status(201).send({
               message: "User Created",
               token,
               user: {
                    firstName: userData.firstName,
                    email: userData.email,
                    phone: userData.phone
               }

          });

     } catch (error) {
          res.status(500).send({
               message: "Error creating user",
               error: error.message
          });
     }
}

async function loginUser(req, res) {
     const { email, password } = req.body;

     try {
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

          // Create token
          const token = jwt.sign(
               { id: isUserExisted._id, email: isUserExisted.email, role: isUserExisted.role },
               process.env.SECRET_KEY,
               { expiresIn: "1d" }
          );

          // Send proper response
          res.status(200).send({
               message: "Login successful ",
               token,
               user: {
                    firstName: isUserExisted.firstName,
                    email: isUserExisted.email,
                    phone: isUserExisted.phone,
                    role: isUserExisted.role
               }
          });

     } catch (error) {
          res.status(500).send({
               message: "Server Error",
               error: error.message
          });
     }
}

async function getAllUser(req, res) {
     console.log(req.body);
     try {
          const getUser = await User.find();
          if (!getUser) {
               return res.status(404).send("users Data not found")
          } else {
               return res.status(200).send(getUser, "All Data fetched succesfully")
          }

     } catch (error) {
          res.status(500).send({
               message: "Server Error",
               error: error.message
          })
     }

}
async function deletedUser(req, res) {
     const { email } = req.body;

     try {
          const result = await User.deleteOne({ email });

          console.log("delete result:", result);

          if (result.deletedCount === 0) {
               return res.status(404).send({
                    message: "User not found / not deleted"
               });
          }

          return res.status(200).send({
               message: "Deleted Successfully",
               data: result
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
          console.log(req.user.id);
          const user = await User.findById(userId).select("-password");
          console.log(user);
          if (!user) {
               return res.status(404).send({
                    message: "User not found",
               });
          }

          return res.status(200).send({
               message: "User profile fetched successfully",
               user,
          });
     } catch (error) {
          return res.status(500).send({
               message: "Server error",
               error: error.message,
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

          if (name) user.firstName = name;

          if (phone && phone !== user.phone) {
               const existingPhone = await User.findOne({ phone });

               if (existingPhone) {
                    return res.status(400).send({
                         message: "Phone number already in use"
                    });
               }

               user.phone = phone;
          }

          // ✅ update password
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
module.exports = { createUser, loginUser, getAllUser, deletedUser, getMe, updateProfile };