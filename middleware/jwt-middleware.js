const jwt = require("jsonwebtoken");
require("dotenv").config();
const { checkIfTokenRestricted } = require("../helper/security");

const verifyToken = async (req, res, next) => {
  const token = req.cookies.token;
  try {
    const verifiedToken = jwt.verify(token, process.env.MY_SECRET);
    req.userId = verifiedToken.userId;

    const result = await checkIfTokenRestricted(verifiedToken.userId, token);

    if (result) {
      res.clearCookie("token");
      return res.status(403).send({
        error: "Account logged in another device, please log in again!",
      });
    }

    next();
  } catch (error) {
    res.clearCookie("token");
    res.status(403).send({ error: "Unauthorized" });
  }
};

module.exports = { verifyToken };
