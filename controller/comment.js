const commentService = require("../service/comment-service");
const { asyncWrapper } = require("../middleware/async-wrapper");
const { generateCustomError } = require("../error/custom-error");

const createNewCommentHandler = asyncWrapper(async (req, res) => {
  const { postId, content } = req.body;
  const { userId } = req;

  if (!content) {
    throw generateCustomError("Content cannot be empty", 400);
  }

  if (!postId) {
    throw generateCustomError("Post ID cannot be empty", 400);
  }

  const comment = await commentService.createComment(userId, postId, content);
  res.status(201).send(comment);
});

const listUsersCommentsHandler = asyncWrapper(async (req, res) => {
  const { userId } = req;

  const comments = await commentService.listUsersComments(userId);
  res.send(comments);
});

module.exports = { listUsersCommentsHandler, createNewCommentHandler };
