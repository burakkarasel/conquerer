const userRepository = require("../database/user-repository");
const { generateCustomError } = require("../error/custom-error");

class UserService {
  userRepository;
  constructor(_userRepository) {
    this.userRepository = _userRepository;
  }

  getUserDetails = async (userId) => {
    try {
      const res = await this.userRepository.getUserDetails(userId);
      if (!res.rows.length) {
        throw generateCustomError("User not found", 404);
      }
      return res.rows[0];
    } catch (error) {
      throw error;
    }
  };

  updateUserDetails = async (userId, fullName, username, dob) => {
    try {
      const previousUserRes = await this.userRepository.getUserDetails(userId);

      if (!previousUserRes.rows.length) {
        throw generateCustomError("User not found", 404);
      }

      const newFullName = fullName || previousUserRes.rows[0].full_name;
      const newUsername = username || previousUserRes.rows[0].user_name;
      const newDob = dob || previousUserRes.rows[0].dob;

      const res = await this.userRepository.updateUserDetails(
        userId,
        newFullName,
        newUsername,
        newDob
      );

      return res.rows[0];
    } catch (error) {
      if (error.code === "23505") {
        throw generateCustomError("Username must be unique", 409);
      }
      throw error;
    }
  };

  deleteUser = async (userId) => {
    try {
      await this.userRepository.deleteUser(userId);
    } catch (error) {
      throw error;
    }
  };
}

module.exports = new UserService(userRepository);
