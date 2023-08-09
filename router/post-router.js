const express = require("express");
const { verifyToken } = require("../middleware/jwt-middleware");
const {
  createPostHandler,
  getPostByIdHandler,
  listPostsHandler,
  updatePostHandler,
  deletePostHandler,
} = require("../controller/post");

const router = express.Router();
router.use(verifyToken);

router.post("/", createPostHandler);
router.get("/:postId", getPostByIdHandler);
router.get("/", listPostsHandler);
router.patch("/:postId", updatePostHandler);
router.delete("/:postId", deletePostHandler);

module.exports = router;
