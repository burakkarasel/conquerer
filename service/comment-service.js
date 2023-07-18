const commentRepository = require("../database/comment-repository");
const { formatComment, formatComments } = require("../helper/formatter");
const { generateCustomError } = require("../error/custom-error");

class CommentService {
  commentRepository;
  constructor(_commentRepository) {
    this.commentRepository = _commentRepository;
  }

  createComment = async (userId, postId, content) => {
    try {
      const res = await this.commentRepository.createComment(
        content,
        postId,
        userId
      );
      return formatComment(res.rows[0]);
    } catch (error) {
      if (error.code === "23503") {
        if (error.constraint === "comments_post_id_fkey") {
          throw generateCustomError("Post not found", 404);
        }
        throw generateCustomError("User not found", 404);
      }
      throw error;
    }
  };

  listUsersComments = async (userId) => {
    try {
      const res = await this.commentRepository.listCommentsOfUser(userId);
      return formatComments(res.rows);
    } catch (error) {
      throw error;
    }
  };
}

module.exports = new CommentService(commentRepository);
