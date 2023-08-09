const express = require("express");
const { verifyToken } = require("../middleware/jwt-middleware");
const {
  listUsersCommentsHandler,
  createNewCommentHandler,
} = require("../controller/comment");

const router = express.Router();
router.use(verifyToken);

router.post("/", createNewCommentHandler);
router.get("/", listUsersCommentsHandler);

module.exports = router;
