const userService = require("../service/user-service");
const { formatUser } = require("../helper/formatter");
const { asyncWrapper } = require("../middleware/async-wrapper");
const { generateCustomError } = require("../error/custom-error");

const getUserDetailsHandler = asyncWrapper(async (req, res) => {
  const { userId } = req;
  const user = await userService.getUserDetails(userId);
  res.send(formatUser(user));
});

const updateUserDetailsHandler = asyncWrapper(async (req, res) => {
  const { userId } = req;
  const { fullName, username, dob } = req.body;
  if (fullName && fullName.length < 3) {
    throw generateCustomError("Full name must be at least 3 characters", 400);
  }
  if (username && username < 2) {
    throw generateCustomError("Username must be at least 2 characters", 400);
  }

  const user = await userService.updateUserDetails(
    userId,
    fullName,
    username,
    dob
  );
  res.status(200).send(formatUser(user));
});

const deleteUserHandler = asyncWrapper(async (req, res) => {
  const { userId } = req;

  await userService.deleteUser(userId);
  res.clearCookie("token");
  res.sendStatus(204);
});

module.exports = {
  getUserDetailsHandler,
  updateUserDetailsHandler,
  deleteUserHandler,
};
