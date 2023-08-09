const express = require("express");
const {
  validateEmail,
  validateString,
  validatePasswordMatch,
  validatePassword,
} = require("../helper/validators");
const authService = require("../service/auth-service");
const { asyncWrapper } = require("../middleware/async-wrapper");
const { generateCustomError } = require("../error/custom-error");

const router = express.Router();

const signUpHandler = asyncWrapper(async (req, res) => {
  const { email, fullName, password, passwordConfirm } = req.body;
  if (!validateEmail(email)) {
    throw generateCustomError("Email format is invalid!", 400);
  }

  if (!password) {
    throw generateCustomError("Password field cannot be empty", 400);
  }

  const passwordValidation = validatePassword(password);
  if (!passwordValidation) {
    throw generateCustomError(
      "Password must be at least 8 characters and must include at least one special character",
      400
    );
  }

  const passwordMatchValidation = validatePasswordMatch(
    password,
    passwordConfirm
  );
  if (passwordMatchValidation) {
    throw generateCustomError(passwordValidation, 400);
  }

  if (!fullName) {
    throw generateCustomError("Full name cannot be empty!", 400);
  }

  const user = await authService.signUp(fullName, email, password);
  res.status(201).send(user);
});

const signInHandler = asyncWrapper(async (req, res) => {
  const { email, password } = req.body;
  if (!validateEmail(email)) {
    throw generateCustomError("Email format is invalid!", 400);
  }

  const passwordValidation = validateString("Password", password, 8);
  if (passwordValidation) {
    throw generateCustomError(passwordValidation, 400);
  }

  const token = await authService.signIn(email, password);
  res.cookie("token", token, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60,
  });

  res.send({ token: token });
});

const passwordResetHandler = asyncWrapper(async (req, res) => {
  const { password, passwordConfirm } = req.body;
  const { userId } = req;

  const passwordMatchValidation = validatePasswordMatch(
    password,
    passwordConfirm
  );

  const passwordValidation = validatePassword(password);
  if (!passwordValidation) {
    throw generateCustomError(
      "Password must be at least 8 characters and must include at least one special character",
      400
    );
  }

  if (passwordMatchValidation) {
    throw generateCustomError(passwordMatchValidation, 400);
  }

  const user = await authService.passwordReset(userId, password);
  res.clearCookie("token");
  res.send({ message: "OK" });
});

module.exports = { passwordResetHandler, signInHandler, signUpHandler };
