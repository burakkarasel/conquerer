const pool = require("./conn");

class PostRepository {
  pool;
  constructor(_pool) {
    this.pool = _pool;
  }
}

module.exports = new PostRepository(pool);
