const express = require("express");
const commentService = require("../service/comment-service");
const { verifyToken } = require("../middleware/jwt-middleware");
const { asyncWrapper } = require("../middleware/async-wrapper");
const { generateCustomError } = require("../error/custom-error");

const router = express.Router();
router.use(verifyToken);

router.post(
  "/",
  asyncWrapper(async (req, res) => {
    const { postId, content } = req.body;
    const { userId } = req;

    if (!content) {
      throw generateCustomError("Content cannot be empty", 400);
    }

    const comment = await commentService.createComment(userId, postId, content);
    res.status(201).send(comment);
  })
);

router.get(
  "/",
  asyncWrapper(async (req, res) => {
    const { userId } = req;

    const comments = await commentService.listUsersComments(userId);
    res.send(comments);
  })
);

module.exports = router;
