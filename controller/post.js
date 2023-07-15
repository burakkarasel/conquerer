const express = require("express");
const { verifyToken } = require("../middleware/jwt-middleware");
const postService = require("../service/post-service");
const {
  validatePostTitleAndContent,
  validatePostCategory,
} = require("../helper/validators");

const router = express.Router();
router.use(verifyToken);

router.post("/", async (req, res) => {
  const { title, content, category } = req.body;
  const { userId } = req;

  const categoryResult = validatePostCategory(category);

  if (categoryResult) {
    res.status(400).send({ error: categoryResult });
    return;
  }

  const titleAndContentResult = validatePostTitleAndContent({ title, content });

  if (titleAndContentResult) {
    res.status(400).send({ error: titleAndContentResult });
    return;
  }

  try {
    const post = await postService.createPost(title, content, category, userId);
    res.status(201).send(post);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.patch("/:postId", async (req, res) => {
  const { postId } = req.params;
  const { userId } = req;
  const { title, content } = req.body;

  const result = validatePostTitleAndContent({ title, content });

  if (result) {
    res.status(400).send({ error: result });
    return;
  }

  try {
    const post = await postService.updatePost(postId, userId, title, content);
    res.send(post);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.get("/:postId", async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await postService.getPostDetails(postId);
    if (!post) {
      res.status(404).send({ error: "Post not found" });
      return;
    }
    res.send(post);
  } catch (error) {
    res.status(500).send({ error: error });
  }
});

router.get("/", async (req, res) => {
  const { self, category } = req.query;
  const { userId } = req;

  if (category) {
    const result = validatePostCategory(category);
    if (result) {
      res.status(400).send({ error: result });
      return;
    }
  }

  if (self && category) {
    res.status(400).send({ error: "Multiple filters are not supported" });
    return;
  }
  try {
    const posts = await postService.listPosts(userId, self, category);
    res.send(posts);
  } catch (error) {
    res.status(500).send({ error: error });
  }
});

router.delete("/:postId", (req, res) => {
  const { postId } = req.params;
  const { userId } = req;

  try {
    postService.deletePost(userId, postId);
    res.sendStatus(204);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
