const express = require("express");
const { verifyToken } = require("../middleware/jwt-middleware");
const postService = require("../service/post-service");
const {
  validatePostTitleAndContent,
  validatePostCategory,
} = require("../helper/validators");
const { asyncWrapper } = require("../middleware/async-wrapper");
const { generateCustomError } = require("../error/custom-error");

const router = express.Router();
router.use(verifyToken);

router.post(
  "/",
  asyncWrapper(async (req, res) => {
    const { title, content, category } = req.body;
    const { userId } = req;

    const categoryResult = validatePostCategory(category);

    if (categoryResult) {
      throw generateCustomError(categoryResult, 400);
    }

    if (!title) {
      throw generateCustomError("Title field cannot be empty", 400);
    }

    if (!content) {
      throw generateCustomError("Content field cannot be empty", 400);
    }

    const titleAndContentResult = validatePostTitleAndContent({
      title,
      content,
    });

    if (titleAndContentResult) {
      throw generateCustomError(titleAndContentResult, 400);
    }

    const post = await postService.createPost(title, content, category, userId);
    res.status(201).send(post);
  })
);

router.patch(
  "/:postId",
  asyncWrapper(async (req, res) => {
    const { postId } = req.params;
    const { userId } = req;
    const { title, content } = req.body;

    if (title && title.length < 2) {
      throw generateCustomError(
        "Title value must be at least 2 characters",
        400
      );
    }

    if (content && content.length < 10) {
      throw generateCustomError(
        "Content value must be at least 10 characters",
        400
      );
    }

    if (!postId) {
      throw generateCustomError("Post ID cannot be empty", 400);
    }

    const post = await postService.updatePost(postId, userId, title, content);
    res.send(post);
  })
);

router.get(
  "/:postId",
  asyncWrapper(async (req, res) => {
    const { postId } = req.params;

    const post = await postService.getPostDetails(postId);
    if (!post) {
      throw generateCustomError("Post not found", 404);
    }
    res.send(post);
  })
);

router.get(
  "/",
  asyncWrapper(async (req, res) => {
    const { self, category } = req.query;
    const { userId } = req;

    if (category) {
      const result = validatePostCategory(category);
      if (result) {
        throw generateCustomError(result, 400);
      }
    }

    if (self && category) {
      throw generateCustomError("Multiple filters are not supported", 400);
    }

    const posts = await postService.listPosts(userId, self, category);
    res.send(posts);
  })
);

router.delete(
  "/:postId",
  asyncWrapper(async (req, res) => {
    const { postId } = req.params;
    const { userId } = req;

    await postService.deletePost(userId, postId);
    res.sendStatus(204);
  })
);

module.exports = router;
