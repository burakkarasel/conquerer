const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  try {
    const verifiedToken = jwt.verify(token, process.env.MY_SECRET);
    req.userId = verifiedToken.userId;
    next();
  } catch (error) {
    res.clearCookie();
    res.status(403).send({ error: "Unauthorized" });
  }
};

module.exports = { verifyToken };
