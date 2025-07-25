const mongoose = require("mongoose");

async function connectMongoDb(url) {
  try {
    await mongoose.connect(url);
    console.log("Database connected successfully");
    return true;
  } catch (error) {
    console.error("Database connection failed:", error);
    throw error;
  }
}

module.exports = { connectMongoDb };
