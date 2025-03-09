require("dotenv").config();
const { Client } = require("pg");

const createDatabase = async () => {
  const dbName = process.env.DB_NAME;
  const client = new Client({
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: "postgres",
  });

  try {
    await client.connect();

    const res = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [dbName]
    );

    if (res.rowCount === 0) {
      await client.query(`CREATE DATABASE ${dbName}`);
      console.log(`Database "${dbName}" created successfully.`);
    } else {
      console.log(`Database "${dbName}" already exists.`);
    }
  } catch (error) {
    console.error("Error creating database:", error);
  } finally {
    await client.end();
  }
};

createDatabase();
