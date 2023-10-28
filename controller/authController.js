const User = require("../models/User");

// @route    GET api/auth
// @desc     Get auth user
// @access   Private
const authUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { authUser };
