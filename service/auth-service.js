require("dotenv").config();
const bcrypt = require("bcrypt");
const userRepository = require("../database/user-repository");
const jwt = require("jsonwebtoken");
const { generateCustomError } = require("../error/custom-error");
const { formatUser } = require("../helper/formatter");
const pg = require("pg");

class AuthService {
  userRepository;
  constructor(_userRepository) {
    this.userRepository = _userRepository;
  }

  signUp = async (fullName, email, password) => {
    try {
      const hashedPassword = await bcrypt.hash(
        password,
        parseInt(process.env.SALT_ROUNDS)
      );

      const username = `${fullName.replace(" ", "").toLowerCase()}#${Math.floor(
        1000 + Math.random() * 9000
      )}`;
      const res = await this.userRepository.createUser(
        fullName,
        email,
        hashedPassword,
        username
      );

      return formatUser(res.rows[0]);
    } catch (error) {
      if (error.code === "23505") {
        throw generateCustomError("Email must be unique", 400);
      }
      throw error;
    }
  };

  signIn = async (email, password) => {
    try {
      const results = await this.userRepository.getUserByEmail(email);

      if (!results.rows.length) {
        throw generateCustomError("User not found with given credentials", 404);
      }

      const res = await bcrypt.compare(password, results.rows[0].password);

      if (!res) {
        throw generateCustomError("User not found with given credentials", 404);
      }

      const token = jwt.sign(
        { userId: results.rows[0].id },
        process.env.MY_SECRET,
        {
          expiresIn: process.env.EXPIRES_IN,
        }
      );

      return token;
    } catch (error) {
      throw error;
    }
  };

  passwordReset = async (userId, newPassword) => {
    try {
      const hashedPassword = await bcrypt.hash(
        newPassword,
        parseInt(process.env.SALT_ROUNDS)
      );

      const res = await this.userRepository.updateUserPassword(
        userId,
        hashedPassword
      );

      return formatUser(res.rows[0]);
    } catch (error) {
      throw error;
    }
  };
}

module.exports = new AuthService(userRepository);
