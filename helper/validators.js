const validateEmail = (email) => {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
};

const validatePostTitleAndContent = (obj) => {
  if (obj.title.length < 2) {
    return "Title must be at least 2 characters";
  }

  if (obj.content.length < 10) {
    return "Content must be at least 10 characters";
  }
};

const validatePostCategory = (category) => {
  const availableCategories = [
    "Artificial Intelligence",
    "Business",
    "Money",
    "Technology",
  ];

  if (!availableCategories.includes(category)) {
    return `Only ${availableCategories.toString()} categories are supported`;
  }

  return "";
};

const validateTimePeriod = (timeType) => {
  const availableTimeType = ["month", "week", "year"];
  if (!availableTimeType.includes(timeType)) {
    return `Only ${availableTimeType.toString()} time periods are supported`;
  }

  return "";
};

const validatePassword = (password) => {
  const re = /^(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?/~`]).{8,}$/;
  return re.test(password);
};

const validateString = (field, str, charCount) => {
  if (!str) {
    return `${field} cannot be empty`;
  }
  return str.length < charCount
    ? `${field} must be at least ${charCount} characters`
    : "";
};

const validatePasswordMatch = (pw, pwConfirm) =>
  pw === pwConfirm ? "" : "Passwords does not match";

module.exports = {
  validatePassword,
  validatePasswordMatch,
  validateString,
  validateEmail,
  validatePostTitleAndContent,
  validatePostCategory,
  validateTimePeriod,
};
