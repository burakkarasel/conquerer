const pool = require("./conn");

class UserRepository {
  pool;
  constructor(_pool) {
    this.pool = _pool;
  }
}

module.exports = new UserRepository(pool);
