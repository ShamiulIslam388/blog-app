const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const {
  authProfile,
  getAllProfiles,
  getProfileById,
  createProfile,
  deleteProfile,
  updateExperience,
  deleteExperience,
  updateEducation,
  deleteEducation,
} = require("../../controller/profileController");

router.get("/me", auth, authProfile);
router.post("/", auth, createProfile);
router.get("/", getAllProfiles);
router.get("/user/:user_id", auth, getProfileById);
router.delete("/", auth, deleteProfile);
router.put("/experience", auth, updateExperience);
router.delete("/experience/:exp_id", auth, deleteExperience);
router.put("/education", auth, updateEducation);
router.delete("/education/:edu_id", auth, deleteEducation);

module.exports = router;
