const { verifyToken } = require("../middleware/jwt-middleware");
const express = require("express");
const {
  getUserDetailsHandler,
  updateUserDetailsHandler,
  deleteUserHandler,
} = require("../controller/user");

const router = express.Router();
router.use(verifyToken);

router.get("/", getUserDetailsHandler);
router.patch("/", updateUserDetailsHandler);
router.delete("/", deleteUserHandler);

module.exports = router;
