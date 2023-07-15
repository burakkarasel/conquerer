const express = require("express");
const userService = require("../service/user-service");
const { verifyToken } = require("../middleware/jwt-middleware");
const { formatUser } = require("../helper/formatter");

const router = express.Router();
router.use(verifyToken);

router.get("/", async (req, res) => {
  const { userId } = req;
  try {
    const user = await userService.getUserDetails(userId);
    res.send(formatUser(user));
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.patch("/", async (req, res) => {
  const { userId } = req;
  const { fullName, username, dob } = req.body;
  if (fullName && fullName.length < 3) {
    res.status(400).send({ error: "Full name must be at least 3 characters" });
    return;
  }
  if (username && username < 2) {
    res.status(400).send({ error: "Username must be at least 2 characters" });
    return;
  }
  try {
    const user = await userService.updateUserDetails(
      userId,
      fullName,
      username,
      dob
    );
    res.status(200).send(formatUser(user));
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.delete("/", (req, res) => {
  const { userId } = req;

  try {
    userService.deleteUser(userId);
    res.clearCookie("token");
    res.sendStatus(204);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
