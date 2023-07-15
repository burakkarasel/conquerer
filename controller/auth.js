const express = require("express");
const { validateEmail } = require("../helper/validators");
const authService = require("../service/auth-service");
const { formatUser } = require("../helper/formatter");
const { verifyToken } = require("../middleware/jwt-middleware");

const router = express.Router();

router.post("/sign-up", async (req, res) => {
  const { email, fullName, password, passwordConfirm } = req.body;
  if (!validateEmail(email)) {
    res.status(400).send({ error: "Email format is invalid!" });
    return;
  }
  if (password !== passwordConfirm) {
    res.status(400).send({ error: "Passwords doesnt match!" });
    return;
  }
  if (password.length < 8) {
    res.status(400).send({ error: "Password must be at least 8 characters" });
    return;
  }
  if (!fullName) {
    res.status(400).send({ error: "Full name cannot be empty!" });
    return;
  }
  try {
    const user = await authService.signUp(fullName, email, password);
    res.status(201).send(formatUser(user));
  } catch (error) {
    res.status(500).send({ error: error.messagge });
  }
});

router.post("/sign-in", async (req, res) => {
  const { email, password } = req.body;
  if (!validateEmail(email)) {
    res.status(400).send({ error: "Email format is invalid!" });
    return;
  }
  if (password.length < 8) {
    res.status(400).send({ error: "Password must be at least 8 characters" });
    return;
  }
  try {
    const token = await authService.signIn(email, password);
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60,
    });
    res.send({ message: "OK" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.patch("/password-reset", verifyToken, async (req, res) => {
  const { password, passwordConfirm } = req.body;
  const { userId } = req;
  if (password !== passwordConfirm) {
    res.status(400).send({ error: "Passwords doesnt match!" });
    return;
  }

  try {
    const user = await authService.passwordReset(userId, password);
    res.clearCookie("token");
    res.send(formatUser(user));
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
