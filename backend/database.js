const pg = require("pg");
const { Pool } = pg;
require('dotenv').config()

const pool = new Pool({
  user: "postgres",
  password: process.env.DB_PASS,
  host: "localhost",
  port: 5436,
  database: "postgres",
});

function validateDbConnection() {
  pool.query("SELECT 1 + 1 AS solution", function (error) {
    if (error) throw error;
    console.log("Database is ready");
  });
}

module.exports = { pool, validateDbConnection };
