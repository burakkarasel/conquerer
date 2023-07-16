const statisticsRepository = require("../database/statistics-repository");

class StatisticsService {
  statisticsRepository;
  constructor(_statisticsRepository) {
    this.statisticsRepository = _statisticsRepository;
  }
  listAllTimesPostPercentagesByCategory = async () => {
    try {
      const [categoryCounts, totalCount] =
        await this.statisticsRepository.listAllTimesByCategory();

      const res = categoryCounts.map((obj) => {
        console.log(obj);
        return {
          category: obj.category,
          percentage: ((obj.count / totalCount) * 100).toFixed(1),
        };
      });

      return res;
    } catch (error) {
      throw error;
    }
  };

  getUserStatistics = async () => {
    try {
      const [bloggerCount, totalUserCount] =
        await this.statisticsRepository.userStatistics();
      const readerCount = totalUserCount - bloggerCount;

      return { bloggerCount, readerCount };
    } catch (error) {
      throw error;
    }
  };

  getPostStatisticsByTimePeriod = async (type) => {
    try {
      let result;
      switch (type) {
        case "week":
          result =
            await this.statisticsRepository.getPostStatisticsByCategoryWeekly();
          break;
        case "month":
          result =
            await this.statisticsRepository.getPostStatisticsByCategoryMonthly();
          break;
        default:
          result =
            await this.statisticsRepository.getPostStatisticsByCategoryYearly();
          break;
      }

      return result;
    } catch (error) {
      throw error;
    }
  };
}

module.exports = new StatisticsService(statisticsRepository);
