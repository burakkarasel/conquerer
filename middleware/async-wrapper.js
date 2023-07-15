const asyncWrapper = (callback) => {
  return async (req, res, next) => {
    try {
      await callback(req, res, next);
      // we call the callback function to handle the request
    } catch (error) {
      next(error);
      // if any error occurs we will catch in error middleware
    }
  };
};
// built this middleware to avoid try catch blocks in controller layer.

module.exports = { asyncWrapper };
