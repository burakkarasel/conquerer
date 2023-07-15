const pool = require("./conn");
const {
  createCommentStmt,
  listUsersCommentsQuery,
  deletePostsCommentsStmt,
} = require("../helper/queries");
const uuid = require("uuid");

class CommentRepository {
  pool;
  constructor(_pool) {
    this.pool = _pool;
  }

  createComment = (content, postId, userId) => {
    return new Promise((resolve, reject) => {
      this.pool.query(
        createCommentStmt,
        [uuid.v4(), content, postId, userId],
        (error, results) => {
          if (error) reject(error);
          resolve(results);
        }
      );
    });
  };

  listCommentsOfUser = (userId) => {
    return new Promise((resolve, reject) => {
      this.pool.query(listUsersCommentsQuery, [userId], (error, results) => {
        if (error) reject(error);
        resolve(results);
      });
    });
  };

  deletePostsComments = (postId) => {
    return new Promise((resolve, reject) => {
      this.pool.query(deletePostsCommentsStmt, [postId], (error, results) => {
        if (error) reject(error);
        resolve(results);
      });
    });
  };
}

module.exports = new CommentRepository(pool);
