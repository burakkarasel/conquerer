const express = require("express");
const commentService = require("../service/comment-service");
const { verifyToken } = require("../middleware/jwt-middleware");

const router = express.Router();
router.use(verifyToken);

router.post("/", async (req, res) => {
  const { postId, content } = req.body;
  const { userId } = req;

  if (!content) {
    res.status(400).send({ error: "Content cannot be empty" });
    return;
  }

  try {
    const comment = await commentService.createComment(userId, postId, content);
    res.status(201).send(comment);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.get("/", async (req, res) => {
  const { userId } = req;

  try {
    const comments = await commentService.listUsersComments(userId);
    res.send(comments);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
