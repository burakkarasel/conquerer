const client = require("./elastic-conn");

class StatisticsRepository {
  client;
  constructor(_client) {
    this.client = _client;
  }

  listAllTimesByCategory = async () => {
    const response = await this.client.search({
      index: "posts",
      body: {
        // size:0 because we dont want the actual documents we only want the count of them
        size: 0,
        aggs: {
          // we aggregate categories to get count
          categories: {
            terms: {
              field: "category",
              size: 4,
            },
          },
          // also we get the total count to get percentages of each category
          totalCount: {
            value_count: {
              field: "id",
            },
          },
        },
      },
    });

    // retrieving category buckets
    const categoryBuckets = response.body.aggregations.categories.buckets;
    const totalCount = response.body.aggregations.totalCount.value;

    // processing the results to get the count of each category
    const categoryCounts = categoryBuckets.map((bucket) => {
      const category = bucket.key;
      const count = bucket.doc_count;
      return { category, count };
    });

    return [categoryCounts, totalCount];
  };

  userStatistics = async () => {
    const bloggerCountResponse = await this.client.search({
      index: "posts",
      body: {
        size: 0,
        aggs: {
          bloggerCount: {
            // get blogger count distinctly
            cardinality: {
              field: "profile.username.keyword",
            },
          },
        },
      },
    });

    const bloggerCount =
      bloggerCountResponse.body.aggregations.bloggerCount.value;

    const totalUserCountResponse = await this.client.search({
      index: "users",
      body: {
        size: 0,
        aggs: {
          totalUserCount: {
            // get all users count
            value_count: {
              field: "email",
            },
          },
        },
      },
    });

    const totalUserCount =
      totalUserCountResponse.body.aggregations.totalUserCount.value;

    return [bloggerCount, totalUserCount];
  };

  getPostStatisticsByCategoryWeekly = async () => {
    const response = await this.client.search({
      index: "posts",
      body: {
        size: 0,
        query: {
          // query by createdAt field
          range: {
            createdAt: {
              gte: "now-7d/d", // now - 7 days
              lte: "now/d",
            },
          },
        },
        aggs: {
          days: {
            // we get each days with date_histogram
            date_histogram: {
              field: "createdAt",
              calendar_interval: "1d",
            },
            // for each day we get categories and their counts
            aggs: {
              categories: {
                terms: {
                  field: "category",
                },
              },
            },
          },
        },
      },
    });

    const dayBuckets = response.body.aggregations.days.buckets;

    const result = dayBuckets.map((bucket) => {
      const date = bucket.key_as_string;
      const categoryCounts = bucket.categories.buckets.reduce(
        (countsOfDay, bucket) => {
          countsOfDay[bucket.key] = bucket.doc_count;
          return countsOfDay;
        },
        {}
      );
      return { date, categoryCounts };
    });

    return result;
  };

  getPostStatisticsByCategoryMonthly = async () => {
    const response = await this.client.search({
      index: "posts",
      body: {
        size: 0,
        query: {
          range: {
            createdAt: {
              // to get last 4 weeks
              gte: "now-3w/w",
              lte: "now",
            },
          },
        },
        aggs: {
          weeks: {
            date_histogram: {
              field: "createdAt",
              calendar_interval: "1w",
            },
            aggs: {
              categories: {
                terms: {
                  field: "category",
                },
              },
            },
          },
        },
      },
    });

    const weekBuckets = response.body.aggregations.weeks.buckets;

    const result = weekBuckets.map((bucket) => {
      const startDate = bucket.key_as_string;
      const categoryCounts = bucket.categories.buckets.reduce(
        (countsOfWeek, bucket) => {
          countsOfWeek[bucket.key] = bucket.doc_count;
          return countsOfWeek;
        },
        {}
      );
      return { startDate, categoryCounts };
    });

    return result;
  };

  getPostStatisticsByCategoryYearly = async () => {
    const response = await this.client.search({
      index: "posts",
      body: {
        size: 0,
        query: {
          range: {
            createdAt: {
              // to get last 12 months
              gte: "now-11M/M",
              lte: "now",
            },
          },
        },
        aggs: {
          months: {
            date_histogram: {
              field: "createdAt",
              calendar_interval: "1M",
            },
            aggs: {
              categories: {
                terms: {
                  field: "category",
                },
              },
            },
          },
        },
      },
    });

    const monthBuckets = response.body.aggregations.months.buckets;

    const result = monthBuckets.map((bucket) => {
      const startDate = bucket.key_as_string;
      const categoryCounts = bucket.categories.buckets.reduce(
        (countsOfMonths, bucket) => {
          countsOfMonths[bucket.key] = bucket.doc_count;
          return countsOfMonths;
        },
        {}
      );
      return { startDate, categoryCounts };
    });

    return result;
  };
}

module.exports = new StatisticsRepository(client);
