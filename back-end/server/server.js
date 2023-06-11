import express from 'express'
import { Pool } from 'pg'
// Load privacy-sensitive information from .env file
require('dotenv').config()
const dbUser = process.env.PSQL_USER
const dbHost = process.env.PSQL_HOST
const dbDatabase = process.env.PSQL_DB
const dbPassword = process.env.PSQL_PASSWORD
const dbPort = process.env.PSQL_PORT
// Create postgre authentication object
const pool = new Pool({
  user: dbUser,
  host: dbHost,
  database: dbDatabase,
  password: dbPassword,
  port: dbPort,
})

const app = express()
// Define GET request to pull data from postgreSQL table
app.get('/users', async (req, res) => {
  try {
    // Select all rows from the users table
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

// Define POST request to post data to postgreSQL table
app.post('/users', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // Insert data into the users table
    const query = 'INSERT INTO users (name, email, password) VALUES ($1, $2, $3)';
    await pool.query(query, [name, email, password]);

    res.sendStatus(200) // Send a success response
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: 'Server error' });
  }
})

const port = 3000
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});