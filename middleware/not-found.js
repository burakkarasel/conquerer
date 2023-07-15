const notFound = (req, res) => {
  res.status(404).send({ error: "Route does not exist!" });
};

module.exports = { notFound };
