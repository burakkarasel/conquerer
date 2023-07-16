const { Client } = require("@elastic/elasticsearch");

const client = new Client({
  cloud: {
    id: "My_deployment:dXMtY2VudHJhbDEuZ2NwLmNsb3VkLmVzLmlvJGUzZTQ5NGUzYmRhMTQ5ZThiNGM3YThmOTgwMzBhZmNiJDIzY2Q0OGIwNmMxYzQ0NTc5YTYxMmZkMmE5N2I5YWM1",
  },
  auth: {
    username: "elastic",
    password: "SPdI5x8jVEiFBfWlE4OgJgNZ",
  },
});

module.exports = client;
