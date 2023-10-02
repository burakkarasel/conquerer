const express = require("express");
const {
  signInHandler,
  signUpHandler,
  passwordResetHandler,
} = require("../controller/auth");
const { verifyToken } = require("../middleware/jwt-middleware");

const router = express.Router();

router.post("/sign-up", signUpHandler);
router.post("/sign-in", signInHandler);
router.patch("/password", verifyToken, passwordResetHandler);

module.exports = router;
