const express = require("express");
const connectDB = require("./config/connectDB");

require("dotenv").config();
const app = express();

//Connect to Database
connectDB();

app.get("/", (req, res) => {
  res.json({ message: "This is home route" });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`server is listening at port ${port}`);
});
