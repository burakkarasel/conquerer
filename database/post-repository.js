const pool = require("./conn");
const {
  createPostStmt,
  getPostDetailsQuery,
  listPostsQuery,
  listUsersPostsQuery,
  listPostsByCategoryQuery,
  updatePostStmt,
  deletePostStmt,
} = require("../helper/queries");
const uuid = require("uuid");

class PostRepository {
  pool;
  constructor(_pool) {
    this.pool = _pool;
  }

  createPost = (title, content, category, userId) => {
    return new Promise((resolve, reject) => {
      this.pool.query(
        createPostStmt,
        [uuid.v4(), title, content, category, userId],
        (error, results) => {
          if (error) reject(error);
          resolve(results.rows[0]);
        }
      );
    });
  };

  getPostDetails = (id) => {
    return new Promise((resolve, reject) => {
      this.pool.query(getPostDetailsQuery, [id], (error, results) => {
        if (error) reject(error);
        resolve(results.rows);
      });
    });
  };

  listLatestPosts = () => {
    return new Promise((resolve, reject) => {
      this.pool.query(listPostsQuery, (error, results) => {
        if (error) reject(error);
        resolve(results.rows);
      });
    });
  };

  listUsersPosts = (userId) => {
    return new Promise((resolve, reject) => {
      this.pool.query(listUsersPostsQuery, [userId], (error, results) => {
        if (error) reject(error);
        console.log("data access layer error: ", error);
        resolve(results.rows);
      });
    });
  };

  listPostsByCategory = (category) => {
    return new Promise((resolve, reject) => {
      this.pool.query(
        listPostsByCategoryQuery,
        [category],
        (error, results) => {
          if (error) reject(error);
          resolve(results.rows);
        }
      );
    });
  };

  updatePost = (postId, userId, title, content) => {
    return new Promise((resolve, reject) => {
      this.pool.query(
        updatePostStmt,
        [title, content, new Date(), postId, userId],
        (error, results) => {
          if (error) reject(error);
          resolve(results.rows[0]);
        }
      );
    });
  };

  deletePost = (postId, userId) => {
    return new Promise((resolve, reject) => {
      this.pool.query(deletePostStmt, [postId, userId], (error, results) => {
        if (error) reject(error);
        resolve();
      });
    });
  };
}

module.exports = new PostRepository(pool);
