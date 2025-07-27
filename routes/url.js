const express = require('express');
const { handleGenerateNewShortURL,handleGetAnalytics,handleGetShortIdUrl } = require("../controllers/url")
const router = express.Router();

router.post("/",handleGenerateNewShortURL)
router.get("/:shortId", handleGetShortIdUrl);
router.get("/analytics/:shortId", handleGetAnalytics)

module.exports = router;