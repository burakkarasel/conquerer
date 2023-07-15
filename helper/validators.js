const validateEmail = (email) => {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
};

const validatePostTitleAndContent = (obj) => {
  if (obj.title.length < 2) {
    return "Title must be at least 2 characters";
  }

  if (obj.title.length < 10) {
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

module.exports = {
  validateEmail,
  validatePostTitleAndContent,
  validatePostCategory,
};
