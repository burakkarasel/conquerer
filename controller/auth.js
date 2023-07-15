const express = require("express");
const { validateEmail } = require("../helper/validators");
const authService = require("../service/auth-service");
const { verifyToken } = require("../middleware/jwt-middleware");
const { asyncWrapper } = require("../middleware/async-wrapper");
const { generateCustomError } = require("../error/custom-error");

const router = express.Router();

router.post(
  "/sign-up",
  asyncWrapper(async (req, res) => {
    const { email, fullName, password, passwordConfirm } = req.body;
    if (!validateEmail(email)) {
      throw generateCustomError("Email format is invalid!", 400);
    }
    if (password !== passwordConfirm) {
      throw generateCustomError("Passwords doesnt match!", 400);
    }
    if (password.length < 8) {
      throw generateCustomError("Password must be at least 8 characters", 400);
    }
    if (!fullName) {
      throw generateCustomError("Full name cannot be empty!", 400);
    }

    const user = await authService.signUp(fullName, email, password);
    res.status(201).send(user);
  })
);

router.post(
  "/sign-in",
  asyncWrapper(async (req, res) => {
    const { email, password } = req.body;
    if (!validateEmail(email)) {
      throw generateCustomError("Email format is invalid!", 400);
    }
    if (password.length < 8) {
      throw generateCustomError("Password must be at least 8 characters", 400);
    }

    const token = await authService.signIn(email, password);
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60,
    });

    res.send({ token: token });
  })
);

router.patch(
  "/password",
  verifyToken,
  asyncWrapper(async (req, res) => {
    const { password, passwordConfirm } = req.body;
    const { userId } = req;
    if (password !== passwordConfirm) {
      throw generateCustomError("Passwords doesnt match!", 400);
    }

    const user = await authService.passwordReset(userId, password);
    res.clearCookie("token");
    res.send(user);
  })
);

module.exports = router;
