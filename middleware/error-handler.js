const { CustomError } = require("../error/custom-error");

const errorHandlerMiddleware = (err, req, res, next) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({ error: err.message });
  }
  return res.status(500).json({ error: err.message });
};

// this is our default error handler so we don't have to use try catch blocks

module.exports = { errorHandlerMiddleware };
