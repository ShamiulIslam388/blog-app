const express = require("express");
const morgan = require("morgan");
const connectDB = require("./config/connectDB");

require("dotenv").config();
const app = express();

//Connect to Database
connectDB();

//use middleware
app.use(morgan("dev"));
app.use(express.json({ extended: false }));
app.use(express.urlencoded({ extended: false }));

app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/post", require("./routes/api/post"));
app.use("/api/contacts", require("./routes/api/contact"));

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`server is listening at port ${port}`);
});
