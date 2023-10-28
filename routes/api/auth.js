const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { authUser } = require("../../controller/authController");

router.get("/", auth, authUser);

module.exports = router;
