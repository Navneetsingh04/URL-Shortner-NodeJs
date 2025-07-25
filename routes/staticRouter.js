const express = require("express");
const router = express.Router();
const URL = require("../models/url")

const { getUser } = require("../service/auth");

router.get("/", async (req, res) => {
  // Check if user is logged in
  const userUid = req.cookies?.uid;
  let allURLs = [];
  
  if (userUid) {
    const user = getUser(userUid);
    if (user) {
      // Show only user's URLs if logged in
      allURLs = await URL.find({ createdBy: user._id });
    }
  }
  
  return res.render("home", {
    urls: allURLs,
  });
});

router.get("/signup", (req,res) => {
  return res.render("signup")
})

router.get("/login" ,(req,res) => {
  return res.render("login")
})
module.exports = router;
