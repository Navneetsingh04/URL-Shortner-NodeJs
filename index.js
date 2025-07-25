const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");


const URL = require("./models/url");
const staticRouter = require("./routes/staticRouter");
const urlRoute = require("./routes/url");
const userRoute = require("./routes/user");
const {restrictToLoggedInUserOnly ,checkAuth}  = require("./middlewares/auth")

const app = express();
const PORT = 8000;

const { connectMongoDb } = require("./config/connection");
connectMongoDb("mongodb://localhost:27017/short-url");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())

app.set("view engine", "ejs");
app.set("views", path.resolve("./view"));

app.get("/url/:shortId", async (req, res) => {
  const shortID = req.params.shortId;
  console.log("Short URL requested:", shortID);
  try {
    if (!shortID) {
      console.log("No shortId provided");
      return res.status(400).json({ error: "shortId is required" });
    }

    const entry = await URL.findOneAndUpdate(
      { shortId: shortID },
      { $push: { visitHistory: { timestamp: Date.now() } } }
    );
    console.log("DB entry for shortId:", entry);

    if (!entry) {
      console.log("No entry found for shortId:", shortID);
      return res.status(404).render("404", { message: "URL not found" });
    }

    res.redirect(entry.redirectedUrl);
  } catch (error) {
    console.error("Error to get shortId Url Address:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});
// Static routes first
app.use("/", staticRouter);
app.use("/user",checkAuth, userRoute);
app.use("/url", restrictToLoggedInUserOnly,urlRoute);

app.get("/test", async (req, res) => {
  const allUrls = await URL.find();
  return res.render("home", {
    urls: allUrls,
    name: "Navneet Singh",
  });
});

app.listen(PORT, () => {
  console.log(`Server is started on ${PORT}`);
});
