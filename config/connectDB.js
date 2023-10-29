const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_STRING_LOCAL);
    console.log("Database connected successfull...");
  } catch (error) {
    console.log("Database connection failed!", error);
    process.exit(1);
  }
};

module.exports = connectDB;
