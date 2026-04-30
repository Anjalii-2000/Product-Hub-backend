const express = require("express")
const { createUser, loginUser, getAllUser, deletedUser, getMe } = require("../controller/UserController.js")
const Auth = require("../middleware/Auth.js")
const RoleAuth = require("../middleware/RoleAuth.js")
const router = express.Router()


router.get('/getUser', getAllUser)
router.delete('/delete', deletedUser)
router.post('/register', createUser)
router.post('/login', loginUser)
router.get("/me", Auth, getMe);

module.exports = router;