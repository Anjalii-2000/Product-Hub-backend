const express = require("express")
const { createUser, loginUser, getAllUser, deletedUser, getMe, updateProfile } = require("../controller/UserController.js")
const Auth = require("../middleware/Auth.js")
const RoleAuth = require("../middleware/RoleAuth.js")
const router = express.Router()


router.get('/getUser', getAllUser)
router.delete('/delete', deletedUser)
router.post('/register', createUser)
router.post('/login', loginUser)
router.get("/me", Auth, getMe);
router.put("/update-profile", Auth, updateProfile);


module.exports = router;