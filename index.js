const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");


const URL = require("./models/url");
const staticRouter = require("./routes/staticRouter");
const urlRoute = require("./routes/url");
const userRoute = require("./routes/user");
const {checkForAutentication ,restrictTo}  = require("./middlewares/auth")

const app = express();
const PORT = 8000;

const { connectMongoDb } = require("./config/connection");
connectMongoDb("mongodb://localhost:27017/short-url");

app.set("view engine", "ejs");
app.set("views", path.resolve("./view"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())
app.use(checkForAutentication);

// Static routes first
app.use("/", staticRouter);
app.use("/user", userRoute);
app.use("/url",restrictTo(["User"]),urlRoute);

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
