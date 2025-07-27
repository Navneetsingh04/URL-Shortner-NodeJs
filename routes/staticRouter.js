const express = require("express");
const router = express.Router();
const URL = require("../models/url")

const { getUser } = require("../service/auth");
const { restrictTo } = require("../middlewares/auth");

router.get("/admin/url",restrictTo(["Admin"]),async(req,res) => {
    const allURLs = await URL.find({});
    return res.render("home",{
      urls: allURLs,
    })
})

router.get("/", async (req, res) => {
  const userUid = req.cookies?.token;
  const lastShortId = req.cookies?.lastShortId;

  const user = userUid ? getUser(userUid) : null;

  let allURLs = [];

  if (user) {
    allURLs = await URL.find({ createdBy: user._id });
  }
  return res.render("home", {
    urls: allURLs,
    shortId: lastShortId,
    user: user,
  });
});


router.get("/signup", (req,res) => {
  return res.render("signup")
})

router.get("/login" ,(req,res) => {
  return res.render("login")
})
module.exports = router;
