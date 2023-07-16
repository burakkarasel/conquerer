const express = require("express");
const statisticsService = require("../service/statistics-service");
const { verifyToken } = require("../middleware/jwt-middleware");
const { asyncWrapper } = require("../middleware/async-wrapper");
const { validateTimePeriod } = require("../helper/validators");
const { generateCustomError } = require("../error/custom-error");

const router = express.Router();
router.use(verifyToken);

router.get(
  "/",
  asyncWrapper(async (req, res) => {
    const results =
      await statisticsService.listAllTimesPostPercentagesByCategory();
    res.send(results);
  })
);

router.get(
  "/users",
  asyncWrapper(async (req, res) => {
    const result = await statisticsService.getUserStatistics();
    res.send(result);
  })
);

router.get(
  "/posts",
  asyncWrapper(async (req, res) => {
    const { type } = req.query;
    const validationResult = validateTimePeriod(type);
    if (validationResult) throw generateCustomError(validationResult, 400);

    const result = await statisticsService.getPostStatisticsByTimePeriod(type);
    res.send(result);
  })
);

module.exports = router;
