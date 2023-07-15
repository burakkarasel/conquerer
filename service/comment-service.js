const commentRepository = require("../database/comment-repository");
const { formatComment, formatComments } = require("../helper/formatter");

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
