const express = require("express");
const router = express.Router();

//@ api/user
//@desc test route
//@public route
router.get("/", (req, res) => {
  res.json({ message: "user route" });
});

module.exports = router;
