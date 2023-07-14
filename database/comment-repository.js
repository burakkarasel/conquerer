const pool = require("./conn");

class CommentRepository {
  pool;
  constructor(_pool) {
    this.pool = _pool;
  }
}

module.exports = new CommentRepository(pool);
