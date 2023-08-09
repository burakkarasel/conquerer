const statisticsService = require("../service/statistics-service");
const { asyncWrapper } = require("../middleware/async-wrapper");
const { validateTimePeriod } = require("../helper/validators");
const { generateCustomError } = require("../error/custom-error");

// "/"
const listAllTimesPostStatisticsHandler = asyncWrapper(async (req, res) => {
  const results =
    await statisticsService.listAllTimesPostPercentagesByCategory();
  res.send(results);
});

// "/users"
const getUserStatisticsHandler = asyncWrapper(async (req, res) => {
  const result = await statisticsService.getUserStatistics();
  res.send(result);
});

// "posts"
const getPostStatisticsByTimeHandler = asyncWrapper(async (req, res) => {
  const { type } = req.query;
  const validationResult = validateTimePeriod(type);
  if (validationResult) throw generateCustomError(validationResult, 400);

  const result = await statisticsService.getPostStatisticsByTimePeriod(type);
  res.send(result);
});

module.exports = {
  listAllTimesPostStatisticsHandler,
  getUserStatisticsHandler,
  getPostStatisticsByTimeHandler,
};
