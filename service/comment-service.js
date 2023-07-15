const commentRepository = require("../database/comment-repository");

class CommentService {
  commentRepository;
  constructor(_commentRepository) {
    this.commentRepository = _commentRepository;
  }

  createComment = (userId, postId, content) => {
    return this.commentRepository.createComment(content, postId, userId);
  };

  listUsersComments = (userId) => {
    return this.commentRepository.listCommentsOfUser(userId);
  };
}

module.exports = new CommentService(commentRepository);
