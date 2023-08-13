const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fileUpload = require('express-fileupload');
const multer = require('multer');
// Load privacy-sensitive information from .env file
require('dotenv').config();
const dbUser = process.env.PSQL_USER;
const dbHost = process.env.PSQL_HOST;
const dbDatabase = process.env.PSQL_DB;
const dbPassword = process.env.PSQL_PASSWORD;
const dbPort = process.env.PSQL_PORT;
const secretKey = process.env.JWT_SECRET_KEY;
// Create postgre authentication object
const pool = new Pool({
  user: dbUser,
  host: dbHost,
  database: dbDatabase,
  password: dbPassword,
  port: dbPort,
});

const storage = multer.memoryStorage(); // Use memory storage to store the file in memory
const upload = multer({ storage }).single('profile-picture'); 
const app = express();
app.use(cors());
app.use(express.json());
app.use(upload);

app.get('/profile/:username', async (req, res) => {
  try {
    const username = req.params.username; // Access the user ID from the URL parameter
    // Query the database to retrieve user data based on the user ID
    const lowerUsername = username.toLowerCase()
    const result = await pool.query('SELECT * FROM user_accounts WHERE LOWER(username) = $1', [lowerUsername]);
    
    if (result.rows.length === 1) {
      const user = result.rows[0];
      // Return the user data as the response
      res.json(user);
    } else {
      // User not found
      res.sendStatus(404);
    }
  } catch (error) {
    console.error('Error retrieving user:', error);
    res.sendStatus(500);
  }
});

app.get('/:name/:id', async (req, res) => {
  try {
    const name = req.params.name; // Access the username from the URL parameter
    const decodedName = decodeURIComponent(name)
    const id = req.params.id; // Access the user ID from the URL parameter
    // Convert the username to lowercase to ensure case-insensitive comparison
    const lowerName = decodedName.toLowerCase();
    
    // Query the database to retrieve competitions where user_id is equal to id
    // and where the first element in the participants array is equal to the username
    const query = `SELECT * FROM competitions WHERE user_id = $1 OR EXISTS (
      SELECT 1
      FROM unnest(participants) AS p
      WHERE LOWER(p->>'name') ILIKE $2
    );`;

    const result = await pool.query(query, [id, lowerName]);

    if (result.rows.length > 0) {
      const competitions = result.rows;
      // Return the competitions data as the response
      res.json(competitions);
    } else {
      // No competitions found
      res.sendStatus(404);
    }
  } catch (error) {
    console.error('Error retrieving competitions:', error);
    res.sendStatus(500);
  }
});
// Define POST request to post user account data to postgreSQL table
app.post('/post_user', async (req, res) => {
  try {
    let { username, email, password, first_name, last_name, phoneNumber } = req.body;
    lowerUsername = username.toLowerCase(); // Convert username to lowercase
    email = email.toLowerCase(); // Convert email to lowercase
    // Check if the username or email already exists in the database
    const checkQuery =
      'SELECT COUNT(*) FROM user_accounts WHERE LOWER(username) = $1 OR LOWER(email) = $2 OR phone_number = $3';
    const checkResult = await pool.query(checkQuery, [lowerUsername, email, phoneNumber]);
    const existingCount = parseInt(checkResult.rows[0].count);

    if (existingCount > 0) {
      // User already exists
      return res.status(400).json({ error: 'Username, phone number, or email already registered' });
    }

    // Insert data into the user_accounts table
    const insertQuery =
      'INSERT INTO user_accounts (username, email, password, first_name, last_name, phone_number) VALUES ($1, $2, $3, $4, $5, $6)';
    await pool.query(insertQuery, [username, email, password, first_name, last_name, phoneNumber]);

    // Generate an authentication token
    const token = jwt.sign({ username, email }, secretKey);

    // Send the token and other user information to the frontend
    res.status(200).json({ token, username, email, first_name, last_name, phoneNumber });

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
    const query = 'SELECT * FROM user_accounts WHERE LOWER(username) = $1 OR LOWER(email) = $2'; // Use a parameterized query for email
    const result = await pool.query(query, [usernameOrEmailLower, usernameOrEmailLower]);

    if (result.rows.length === 1) {
      const user = result.rows[0];
      if (password === user.password) {
        const token = jwt.sign({ username: user.username }, secretKey);
        res.json({ token, username: user.username, user_id: user.user_id, phone_number: user.phone_number }); // Include user_id in the response
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

app.get('/event/:competition/:id', async (req, res) => {
  try {
    const competition = req.params.competition; 
    const eventId = req.params.id
    // Query the database to retrieve user data based on the user ID
    const lowerCompetition = competition.toLowerCase()
    const result = await pool.query('SELECT * FROM competitions WHERE post_id = $1', [eventId]);
    
    if (result.rows.length === 1) {
      const user = result.rows[0];
      // Return the user data as the response
      res.json(user);
    } else {
      // User not found
      res.sendStatus(404);
    }
  } catch (error) {
    console.error('Error retrieving user:', error);
    res.sendStatus(500);
  }
});

app.post('/event/:competition/:id/delete', async (req, res) => {
  try {
    const competition = req.params.competition; 
    const eventId = req.params.id;
    // Query the database to retrieve user data based on the user ID
    const lowerCompetition = competition.toLowerCase();
    const result = await pool.query('DELETE FROM competitions WHERE post_id = $1', [eventId]);

    if (result.rowCount === 1) {
      // Deletion successful
      res.sendStatus(200);
    } else {
      // Event not found or not deleted successfully
      res.sendStatus(404);
    }
  } catch (error) {
    console.error('Error deleting event:', error);
    res.sendStatus(500);
  }
});

// app.post('/user/:username/profile-picture', upload, async(req, res) => {
//   upload(req, res, async (err) => {
//     if (err) {
//       console.error('Error uploading file:', err);
//       return res.sendStatus(500);
//     }

//     try {
//       const username = req.params.username;
//       const file = req.file.buffer; // Access the uploaded file using req.file
//       console.log('req.file:', req.file);
//       console.log('file:', file);

//       // Query the database to update the profile picture of the user with matching username
//       const lowerUsername = username.toLowerCase();
//       const result = await pool.query('UPDATE user_accounts SET profile_picture = $1 WHERE LOWER(username) = $2 RETURNING *', [file, lowerUsername]);

//       if (result.rows.length === 1) {
//         const user = result.rows[0];
//         user.profile_picture = file
//         // Return the updated user data as the response
//         res.json(user);
//       } else {
//         // User not found
//         res.sendStatus(404);
//       }
//     } catch (error) {
//       console.error('Error updating profile picture:', error);
//       res.sendStatus(500);
//     }
//   });
// });

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
    const { user_id, title, description, organizer, location, time, date, images, categories, price } = req.body;
    // Insert data into the users table
    const query = 'INSERT INTO competitions (user_id, title, description, organizer, location, event_time, date, images, category, price) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)';
    await pool.query(query, [user_id, title, description, organizer, location, time, date, images, categories, price]);

    res.sendStatus(200) // Send a success response
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: 'Server error' });
  }
})

app.post('/review', async (req, res) => {
  try {
    const {name, review, id} = req.body
    
    // Insert data into the users table
    const query = 'UPDATE reviews SET general_reviews = general_reviews || $1';
    await pool.query(query, [[{ name, review, id }]]);

    res.json(200) // Send a success response
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: 'Server error' });
  }
})

app.post('/participate/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { name, phoneNumber, username } = req.body; // Assuming your request contains name and phoneNumber

    const checkQuery = 'SELECT participants FROM competitions WHERE post_id = $1';
    const checkResult = await pool.query(checkQuery, [id]);
    const participants = checkResult.rows[0]?.participants || [];

    // Check if the user is already a participant
    const isAlreadyParticipant = participants.some((participant) => participant.username.toLowerCase() === username.toLowerCase());

    if (isAlreadyParticipant) {
      // User already exists
      return res.status(400).json({ error: 'You are already registered for this event!' });
    }
  


    // Add the user to the participants array

    // Query to update the 'participants' column in the 'competitions' table
    const updateQuery = `
  UPDATE competitions
  SET participants = participants || $1
  WHERE post_id = $2;
`;

// Execute the query using the pool
await pool.query(updateQuery, [[{ name, 'username': username, 'phone_number': phoneNumber }], id]);

    res.status(200).json({ message: 'Successfully updated participants' });
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/newsletter', async (req, res) => {
  try {
    const { passedEmail } = req.body;

    const checkQuery = 'SELECT newsletter_email_list FROM reviews';
    const checkResult = await pool.query(checkQuery);
    const existingEmailList = checkResult.rows[0]?.newsletter_email_list || [];

    // Check if the user is already subscribed
    const isAlreadySubscribed = existingEmailList.some(emailObj => emailObj.email?.toLowerCase() === passedEmail?.toLowerCase());

    if (isAlreadySubscribed) {
      return res.status(400).json({ error: 'You are already subscribed!' });
    }

    // Update the email list in the database
    const updateQuery = `
      UPDATE reviews
      SET newsletter_email_list = newsletter_email_list || $1`;

    await pool.query(updateQuery, [[{ email: passedEmail }]]);

    res.status(200).json({ message: 'Successfully updated newsletter email list' });
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: 'Server error' });
  }
});

const port = 3000
app.listen(port, () => {
});