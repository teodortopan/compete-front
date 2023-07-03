const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
// Load privacy-sensitive information from .env file
require('dotenv').config();
const dbUser = process.env.PSQL_USER;
const dbHost = process.env.PSQL_HOST;
const dbDatabase = process.env.PSQL_DB;
const dbPassword = process.env.PSQL_PASSWORD;
const dbPort = process.env.PSQL_PORT;
// Create postgre authentication object
const pool = new Pool({
  user: dbUser,
  host: dbHost,
  database: dbDatabase,
  password: dbPassword,
  port: dbPort,
});

const app = express();
app.use(cors());
app.use(express.json());

// Define POST request to post user account data to postgreSQL table
app.post('/post_user', async (req, res) => {
  try {
    let { username, email, password, first_name, last_name } = req.body;
    username = username.toLowerCase(); // Convert username to lowercase
    email = email.toLowerCase(); // Convert email to lowercase

    // Check if the username or email already exists in the database
    const checkQuery =
      'SELECT COUNT(*) FROM user_accounts WHERE LOWER(username) = $1 OR LOWER(email) = $2';
    const checkResult = await pool.query(checkQuery, [username, email]);
    const existingCount = parseInt(checkResult.rows[0].count);

    if (existingCount > 0) {
      // User already exists
      return res.status(400).json({ error: 'Username or email already registered' });
    }

    // Insert data into the user_accounts table
    const insertQuery =
      'INSERT INTO user_accounts (username, email, password, first_name, last_name) VALUES ($1, $2, $3, $4, $5)';
    await pool.query(insertQuery, [username, email, password, first_name, last_name]);

    res.sendStatus(200); // Send a success response
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Define POST request for user login
app.post('/login', async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body;
    const usernameOrEmailLower = usernameOrEmail.toLowerCase(); // Convert input to lowercase

    // Query the database to retrieve user account data based on the provided username/email
    const query = 'SELECT * FROM user_accounts WHERE LOWER(username) = $1 OR LOWER(email) = $1';
    const result = await pool.query(query, [usernameOrEmailLower]);

    if (result.rows.length === 1) {
      const user = result.rows[0];
      if (user.password === password) {
        const token = jwt.sign({ username: user.username }, 'secretKey');
        res.json({ token, username: user.username });
      } else {
        res.sendStatus(401); // Invalid password
      }
    } else {
      res.sendStatus(401); // Invalid username/email
    }
  } catch (error) {
    console.error('Error logging in:', error);
    res.sendStatus(500);
  }
});
// Define GET request to pull user account data from postgreSQL table
app.get('/user_accounts', async (req, res) => {
  try {
    // Select all rows from the users table
    const result = await pool.query('SELECT * FROM user_accounts');
    res.json(result.rows);
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

app.get('/competitions', async (req, res) => {
  try {
    // Select all rows from the users table
    const result = await pool.query('SELECT * FROM competitions');
    res.json(result.rows);
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

app.get('/username', async (req, res) => {
  try {
    const email = req.query.email; // Access email from query parameters
    const lowerEmail = email.toLowerCase();
    // Select the username from the user_accounts table based on the email
    const result = await pool.query('SELECT username FROM user_accounts WHERE LOWER(email) = $1', [lowerEmail]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Define POST request to post user account data to postgreSQL table
app.post('/post_competitions', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // Insert data into the users table
    const query = 'INSERT INTO competitions (username, email, password) VALUES ($1, $2, $3)';
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