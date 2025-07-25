const { nanoid } = require("nanoid");
const URL = require("../models/url");

async function handleGenerateNewShortURL(req, res) {
  const body = req.body;
  try {
    if (!body.url) return res.status(400).json({ error: "url is required" });
    const shortID = nanoid(8);
    await URL.create({
      shortId: shortID,
      redirectedUrl: body.url,
      visitHistory: [],
      createdBy: req.user?._id,
    });

    let urls = [];
    if (req.user && req.user._id) {
      urls = await URL.find({ createdBy: req.user?._id });
    } else {
      urls = await URL.find();
    }
    return res.render("home", {
      urls,
      shortId: shortID,
    });
  } catch (error) {
    console.error("Error creating short URL:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function handleGetShortIdUrl(req, res) {
  const shortID = req.params.shortId;

  try {
    if (!shortID) return res.status(400).json({ error: "shortId is required" });

    const entry = await URL.findOneAndUpdate(
      { shortId: shortID },
      { $push: { visitHistory: { timestamp: Date.now() } } }
    );

    if (!entry) {
      return res.status(404).json({ error: "URL not found" });
    }

    res.redirect(entry.redirectedUrl);
  } catch (error) {
    console.error("Error to get shortId Url Address:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function handleGetAnalytics(req, res) {
  const shortId = req.params.shortId;

  try {
    const result = await URL.findOne({ shortId });

    if (!result) {
      return res.status(404).json({ error: "URL not found" });
    }

    return res.json({
      totalClick: result.visitHistory.length,
      analytics: result.visitHistory,
    });
  } catch (error) {
    console.error("Error getting analytics:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  handleGenerateNewShortURL,
  handleGetAnalytics,
  handleGetShortIdUrl,
};
