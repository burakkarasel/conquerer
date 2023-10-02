const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  database: process.env.POSTGRES_DB,
  port: process.env.POSTGRES_PORT,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: process.env.POSTGRES_HOST,
});

module.exports = pool;
