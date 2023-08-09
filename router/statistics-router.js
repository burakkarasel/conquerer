const express = require("express");
const { verifyToken } = require("../middleware/jwt-middleware");
const {
  listAllTimesPostStatisticsHandler,
  getPostStatisticsByTimeHandler,
  getUserStatisticsHandler,
} = require("../controller/statistics");

const router = express.Router();
router.use(verifyToken);

router.get("/", listAllTimesPostStatisticsHandler);
router.get("/users", getUserStatisticsHandler);
router.get("/posts", getPostStatisticsByTimeHandler);

module.exports = router;
