
const express = require("express")
const { handleuserSignUp, handleuserLogin } = require("../controllers/user")
const router = express.Router();

router.post("/",handleuserSignUp)
router.post("/login",handleuserLogin)

module.exports = router;