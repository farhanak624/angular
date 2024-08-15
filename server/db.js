const { Pool } = require("pg");
const dotenv = require("dotenv");
dotenv.config();


const password = process.env.DB_PASSWORD;
console.log('Database password type:', typeof password);
console.log('Database password value:', password);  // Be cautious with logging sensitive data

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT, 10),
  ssl: {
    rejectUnauthorized: false,
  },

  });

  module.exports = pool;