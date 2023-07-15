require("dotenv").config();
const bcrypt = require("bcrypt");
const userRepository = require("../database/user-repository");
const jwt = require("jsonwebtoken");

class AuthService {
  userRepository;
  constructor(_userRepository) {
    this.userRepository = _userRepository;
  }

  signUp = async (fullName, email, password) => {
    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(process.env.SALT_ROUNDS)
    );

    return this.userRepository.createUser(fullName, email, hashedPassword);
  };

  signIn = async (email, password) => {
    const user = await this.userRepository.getUserByEmail(email);

    const res = await bcrypt.compare(password, user.password);

    if (!res) {
      throw new Error("User not found with given credentials");
    }

    const token = jwt.sign({ userId: user.id }, process.env.MY_SECRET, {
      expiresIn: process.env.EXPIRES_IN,
    });

    return token;
  };

  passwordReset = async (userId, newPassword) => {
    const hashedPassword = await bcrypt.hash(
      newPassword,
      parseInt(process.env.SALT_ROUNDS)
    );

    const user = await this.userRepository.updateUserPassword(
      userId,
      hashedPassword
    );

    return user;
  };
}

module.exports = new AuthService(userRepository);
