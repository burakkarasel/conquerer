class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

const generateCustomError = (msg, statusCode) => {
  return new CustomError(msg, statusCode);
};

module.exports = { generateCustomError, CustomError };
