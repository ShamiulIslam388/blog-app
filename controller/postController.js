const User = require("../models/User");
const Post = require("../models/Post");

// @route    POST api/post
// @desc     Create a post
// @access   private
const createPost = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    const post = new Post({
      user: req.user.id,
      name: user.name,
      avatar: user.avatar,
      text: req.body.text,
    });

    await post.save();
    res.status(201).json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// @route    GET api/post
// @desc     Get all blog posts by auth user
// @access   private
const getAllPostsByAuthUser = async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    if (posts.length < 1)
      return res.status(400).json({ message: "No posts available" });
    res.status(400).json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// @route    GET api/post/:post_id
// @desc     Get post by id
// @access   private
const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);
    if (!post) return res.status(400).json({ message: "No post found" });
    res.status(400).json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// @route    DELETE api/post/:post_id
// @desc     Delete a post
// @access   private
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);
    if (!post) return res.status(400).json({ message: "No post found" });
    if (req.user.id !== post.user.toString())
      return res
        .status(400)
        .json({ message: "Unauthorized user to delete the post" });
    await post.deleteOne({ _id: req.params.post_id });
    res.status(400).json({ message: "Post deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// @route    PUT api/post/like/:post_id
// @desc     Like a post
// @access   private
const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);
    const likes = post.likes.filter(
      (like) => like.user.toString() === req.user.id
    );
    if (likes.length > 0)
      return res.status(400).json({ message: "Post is already liked" });
    post.likes.unshift({ user: req.user.id });
    await post.save();
    res.status(200).json(post.likes);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// @route    PUT api/post/unlike/:post_id
// @desc     Unlike a post
// @access   private
const unlikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);
    const likes = post.likes.filter(
      (like) => like.user.toString() === req.user.id
    );
    if (likes.length === 0)
      return res.status(400).json({ message: "Post is not liked yet" });
    const IndexToFind = post.likes
      .map((like) => like.user.toString())
      .indexOf(req.user.id);
    post.likes.splice(IndexToFind, 1);
    await post.save();
    res.status(200).json(post.likes);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// @route    POST api/post/comment/:comment_id
// @desc     Comment a post
// @access   private
const commentPost = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    let post = await Post.findById(req.params.comment_id);
    const comment = {
      user: req.user.id,
      name: user.name,
      avatar: user.avatar,
      text: req.body.text,
    };

    post.comments.unshift(comment);

    await post.save();
    res.status(201).json(post.comments);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// @route    DELETE api/post/comment/:id/:comment_id
// @desc     Delete a comment from a post
// @access   private
const uncommentPost = async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);
    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    );
    if (!comment)
      return res.status(404).json({ message: "Comment is not exists" });
    if (comment.user.toString() !== req.user.id)
      return res.status(400).json({ message: "Unauthorized user" });
    const IndexToFind = post.comments
      .map((comment) => comment.user.toString())
      .indexOf(req.user.id);
    post.comments.splice(IndexToFind, 1);
    await post.save();
    res.status(200).json(post.comments);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createPost,
  getAllPostsByAuthUser,
  getPostById,
  deletePost,
  likePost,
  unlikePost,
  commentPost,
  uncommentPost,
};
