const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");

const {
  createPost,
  getAllPostsByAuthUser,
  getPostById,
  deletePost,
  likePost,
  commentPost,
  uncommentPost,
} = require("../../controller/postController");

router.post("/", auth, createPost);
router.get("/", auth, getAllPostsByAuthUser);
router.get("/:post_id", auth, getPostById);
router.delete("/:post_id", auth, deletePost);
router.put("/like/:post_id", auth, likePost);
router.put("/unlike/:post_id", auth);
router.post("/comment/:comment_id", auth, commentPost);
router.delete("/comment/:id/:comment_id", auth, uncommentPost);

module.exports = router;
