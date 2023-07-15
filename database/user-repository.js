const pool = require("./conn");
const {
  createUserStmt,
  getUserDetailsQuery,
  getUserByEmailQuery,
  updateUserDetailsStmt,
  updateUserPasswordStmt,
  deleteUserStmt,
} = require("../helper/queries");
const uuid = require("uuid");

class UserRepository {
  pool;
  constructor(_pool) {
    this.pool = _pool;
  }

  createUser = (fullName, email, password) => {
    return new Promise((resolve, reject) => {
      this.pool.query(
        createUserStmt,
        [uuid.v4(), fullName, email, password, fullName],
        (error, results) => {
          if (error) reject(error);
          resolve(results.rows[0]);
        }
      );
    });
  };

  getUserDetails = (id) => {
    return new Promise((resolve, reject) => {
      this.pool.query(getUserDetailsQuery, [id], (error, results) => {
        if (error) reject(error);
        resolve(results.rows[0]);
      });
    });
  };

  getUserByEmail = (email) => {
    return new Promise((resolve, reject) => {
      this.pool.query(getUserByEmailQuery, [email], (error, results) => {
        if (error) reject(error);
        resolve(results.rows[0]);
      });
    });
  };

  updateUserDetails = (id, fullName, username, dob) => {
    return new Promise((resolve, reject) => {
      this.pool.query(
        updateUserDetailsStmt,
        [fullName, username, dob, new Date(), id],
        (error, results) => {
          if (error) reject(error);
          resolve(results.rows[0]);
        }
      );
    });
  };

  updateUserPassword = (id, password) => {
    return new Promise((resolve, reject) => {
      this.pool.query(
        updateUserPasswordStmt,
        [password, new Date(), id],
        (error, results) => {
          if (error) reject(error);
          resolve(results.rows[0]);
        }
      );
    });
  };

  deleteUser = (id) => {
    return new Promise((resolve, reject) => {
      this.pool.query(deleteUserStmt, [id], (error, results) => {
        if (error) reject(error);
        resolve();
      });
    });
  };
}

module.exports = new UserRepository(pool);
