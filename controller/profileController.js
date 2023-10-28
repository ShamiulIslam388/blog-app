const Profile = require("../models/Profile");
const User = require("../models/User");

// @route    GET api/profile/me
// @desc     Get current users profile
// @access   Private
const authProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      "user",
      ["avatar", "name"]
    );
    if (!profile) {
      return res
        .status(400)
        .json({ message: "There is no profile for this user" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// @route    get api/profile
// @desc     get all profiles
// @access   Public
const getAllProfiles = async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    if (profiles.length < 1)
      return res.status(400).json({ message: "No profiles available" });
    res.status(200).json(profiles);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// @route    get api/profile/user/:user_id
// @desc     Get user by id
// @access   private
const getProfileById = async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate("user", ["name", "avatar"]);
    if (!profile)
      return res
        .status(400)
        .json({ message: "No profile available with this user" });
    res.status(200).json(profile);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "No profile available with this user" });
  }
};

// @route    POST api/profile
// @desc     Create and Update profile
// @access   Private
const createProfile = async (req, res) => {
  // Get fields
  const profileFields = {};
  profileFields.user = req.user.id;
  if (req.body.company) profileFields.company = req.body.company;
  if (req.body.website) profileFields.website = req.body.website;
  if (req.body.location) profileFields.location = req.body.location;
  if (req.body.bio) profileFields.bio = req.body.bio;
  if (req.body.status) profileFields.status = req.body.status;
  if (req.body.githubusername)
    profileFields.githubusername = req.body.githubusername;
  // Skills - Spilt into array
  if (typeof req.body.skills !== "undefined") {
    profileFields.skills = req.body.skills.split(",");
  }

  // Social
  profileFields.social = {};
  if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
  if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
  if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
  if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
  if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

  try {
    let profile = await Profile.findOne({ user: req.user.id });
    if (profile) {
      profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true }
      );
      return res.status(201).json(profile);
    }

    profile = new Profile(profileFields);
    await profile.save();
    res.status(201).json(profile);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// @route    DELETE api/profile
// @desc     Delete profile and user
// @access   private
const deleteProfile = async (req, res) => {
  try {
    await Profile.findOneAndRemove({ user: req.user.id });
    await User.findOneAndRemove({ _id: req.user.id });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// @route    UPDATE api/profile/experience
// @desc     update profile experienace
// @access   private
const updateExperience = async (req, res) => {
  const { title, company, location, from, to, current, description } = req.body;
  try {
    let profile = await Profile.findOne({ user: req.user.id });
    if (!profile)
      return res
        .status(400)
        .json({ message: "No profile to update experience" });
    const newProfileExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    };
    profile.experience.unshift(newProfileExp);
    await profile.save();

    res.status(200).json(profile);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// @route    DELETE api/profile/experience/:exp_id
// @desc     Delete profile experience by its id
// @access   private
const deleteExperience = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    const IndexToRemove = profile.experience
      .map((item) => item.id)
      .indexOf(req.params.exp_id);
    profile.experience.splice(IndexToRemove, 1);
    await profile.save();
    res.status(200).json(profile);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// @route    UPDATE api/profile/education
// @desc     update profile education
// @access   private
const updateEducation = async (req, res) => {
  const { school, degree, fieldofstudy, from, to, current, description } =
    req.body;
  try {
    let profile = await Profile.findOne({ user: req.user.id });
    if (!profile)
      return res
        .status(400)
        .json({ message: "No profile to update education" });
    const newProfileEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    };
    profile.education.unshift(newProfileEdu);
    await profile.save();

    res.status(200).json(profile);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// @route    DELETE api/profile/education/:edu_id
// @desc     Delete profile education
// @access   private
const deleteEducation = async (req, res) => {
  try {
    let profile = await Profile.findOne({ user: req.user.id });
    if (!profile)
      return res
        .status(400)
        .json({ message: "No profile to delete education" });
    const ArrayOfEduId = profile.education.map((item) => item.id);
    const IndexToDeleteEdu = ArrayOfEduId.indexOf(req.params.edu_id);
    profile.education.splice(IndexToDeleteEdu, 1);
    await profile.save();
    res.status(200).json(profile);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  authProfile,
  getAllProfiles,
  getProfileById,
  createProfile,
  deleteProfile,
  updateExperience,
  deleteExperience,
  updateEducation,
  deleteEducation,
};
