const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const {
  getContacts,
  createContact,
  getContact,
  updateContact,
  deleteContact,
} = require("../../controller/contactController");

router.use(auth);
router.route("/").get(getContacts).post(createContact);
router.route("/:id").get(getContact).put(updateContact).delete(deleteContact);

module.exports = router;
