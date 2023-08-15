const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const AWS = require('aws-sdk');
const ssm = new AWS.SSM();
const secretKeyParam = process.env.SECRET_KEY_PARAM; // Replace with the name of your secret key parameter
let secretKey
// Load privacy-sensitive information from .env file
require('dotenv').config();
exports.handler = async (event) => {
  try {
  // Load JWT secret key from AWS Systems Manager Parameter Store
  if (!secretKey) {
    const param = await ssm.getParameter({ Name: secretKeyParam, WithDecryption: true }).promise();
    secretKey = param.Parameter.Value;
  }

  const pool = new Pool({
    user: process.env.USERNAME,
    host: process.env.HOST,
    database: process.env.DB,
    password: process.env.PASSWORD,
    port: process.env.PORT,
  });

  if(event.httpMethod === 'GET') {
    if(event.path === '/profile/:username') {
      const username = event.pathParameters.username; // Access the user ID from the URL parameter
      // Query the database to retrieve user data based on the user ID
      const lowerUsername = username.toLowerCase()
      try {
        const result = await pool.query('SELECT * FROM user_accounts WHERE LOWER(username) = $1', [lowerUsername]);
          
        if (result.rows.length === 1) {
          const user = result.rows[0];
            // Return the user data as the response
          return {
            statusCode: 200,
            body: JSON.stringify(user),
          };
        } else {
            // User not found
          return {
            statusCode: 404,
            body: JSON.stringify({ error: 'User not found' }),
          };
        }
      } catch (error) {
        console.error('Error retrieving user:', error);
        return {
          statusCode: 500,
          body: JSON.stringify({ error: 'Internal Server Error' }),
        };
      }
    } else if(event.path === '/:name/:id') {
      const name = event.pathParameters.name; // Access the username from the URL parameter
      const decodedName = decodeURIComponent(name);
      const id = event.pathParameters.id; // Access the user ID from the URL parameter
      const lowerName = decodedName.toLowerCase();
      
      const query = `SELECT * FROM competitions WHERE user_id = $1 OR EXISTS (
        SELECT 1
        FROM unnest(participants) AS p
        WHERE LOWER(p->>'name') ILIKE $2
      );`;
  
      try {
        const result = await pool.query(query, [id, lowerName]);
  
        if (result.rows.length > 0) {
          const competitions = result.rows;
          return {
            statusCode: 200,
            body: JSON.stringify(competitions),
          };
        } else {
          return {
            statusCode: 404,
            body: JSON.stringify({ error: 'No competitions found' }),
          };
        }
      } catch (error) {
        console.error('Error retrieving competitions:', error);
        return {
          statusCode: 500,
          body: JSON.stringify({ error: 'Internal Server Error' }),
        };
      }
    } else if(event.path === '/event/:competition/:id') {
      const competition = event.pathParameters.competition;
      const eventId = event.pathParameters.id;
      const lowerCompetition = competition.toLowerCase();
      
      try {
        const result = await pool.query('SELECT * FROM competitions WHERE post_id = $1', [eventId]);
  
        if (result.rows.length === 1) {
          const eventData = result.rows[0];
          return {
            statusCode: 200,
            body: JSON.stringify(eventData),
          };
        } else {
          return {
            statusCode: 404,
            body: JSON.stringify({ error: 'Event not found' }),
          };
        }
      } catch (error) {
        console.error('Error retrieving event:', error);
        return {
          statusCode: 500,
          body: JSON.stringify({ error: 'Internal Server Error' }),
        };
      }
    } else if(event.path === '/competitions') {
      try {
        const result = await pool.query('SELECT * FROM competitions');
        return {
          statusCode: 200,
          body: JSON.stringify(result.rows),
        };
      } catch (error) {
        console.error('Error executing query', error);
        return {
          statusCode: 500,
          body: JSON.stringify({ error: 'Internal Server Error' }),
        };
      }
    } else if(event.path === '/username') {
      try {
        const email = event.queryStringParameters.email; // Access email from query parameters
        const lowerEmail = email.toLowerCase();
        const result = await pool.query('SELECT username FROM user_accounts WHERE LOWER(email) = $1', [lowerEmail]);
        return {
          statusCode: 200,
          body: JSON.stringify(result.rows),
        };
      } catch (error) {
        console.error('Error executing query:', error);
        return {
          statusCode: 500,
          body: JSON.stringify({ error: 'Internal Server Error' }),
        };
      }
    }
  } else if(event.httpMethod === 'POST') {
    if(event.path === '/post_user') {
      try {
        const body = JSON.parse(event.body);
        let { username, email, password, first_name, last_name, phoneNumber } = body;
        const lowerUsername = username.toLowerCase(); // Convert username to lowercase
        email = email.toLowerCase(); // Convert email to lowercase

        // Check if the username, email, or phone number already exists in the database
        const checkQuery =
          'SELECT COUNT(*) FROM user_accounts WHERE LOWER(username) = $1 OR LOWER(email) = $2 OR phone_number = $3';
        const checkResult = await pool.query(checkQuery, [lowerUsername, email, phoneNumber]);
        const existingCount = parseInt(checkResult.rows[0].count);

        if (existingCount > 0) {
          // User already exists
          return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Username, phone number, or email already registered' }),
          };
        }

        // Insert data into the user_accounts table
        const insertQuery =
          'INSERT INTO user_accounts (username, email, password, first_name, last_name, phone_number) VALUES ($1, $2, $3, $4, $5, $6)';
        await pool.query(insertQuery, [username, email, password, first_name, last_name, phoneNumber]);

        // Generate an authentication token
        const token = jwt.sign({ username, email }, secretKey);

        // Send the token and other user information to the frontend
        return {
          statusCode: 200,
          body: JSON.stringify({ token, username, email, first_name, last_name, phoneNumber }),
        };
      } catch (err) {
        console.error('Error executing query', err);
        return {
          statusCode: 500,
          body: JSON.stringify({ error: 'Server error' }),
        };
      }
    } else if(event.path === '/login') {
      try {
        const body = JSON.parse(event.body);
        const { usernameOrEmail, password } = body;
        const usernameOrEmailLower = usernameOrEmail.toLowerCase(); // Convert input to lowercase

        // Query the database to retrieve user account data based on the provided username/email
        const query = 'SELECT * FROM user_accounts WHERE LOWER(username) = $1 OR LOWER(email) = $2'; // Use a parameterized query for email
        const result = await pool.query(query, [usernameOrEmailLower, usernameOrEmailLower]);

        if (result.rows.length === 1) {
          const user = result.rows[0];
          if (password === user.password) {
            const token = jwt.sign({ username: user.username }, secretKey);
            return {
              statusCode: 200,
              body: JSON.stringify({
                token,
                username: user.username,
                user_id: user.user_id,
                phone_number: user.phone_number,
              }),
            };
          } else {
            return {
              statusCode: 401,
              body: JSON.stringify({ error: 'Invalid password' }),
            };
          }
        } else {
          return {
            statusCode: 401,
            body: JSON.stringify({ error: 'Invalid username/email' }),
          };
        }
      } catch (error) {
        console.error('Error logging in:', error);
        return {
          statusCode: 500,
          body: JSON.stringify({ error: 'Server error' }),
        };
      }
    } else if(event.path === '/event/:competition/:id/delete') {
      try {
        const pathSegments = event.path.split('/');
        const competition = pathSegments[2];
        const eventId = pathSegments[3];
        const lowerCompetition = competition.toLowerCase();

        // Query the database to delete the event based on the post ID
        const result = await pool.query('DELETE FROM competitions WHERE post_id = $1', [eventId]);

        if (result.rowCount === 1) {
          // Deletion successful
          return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Deletion successful' }),
          };
        } else {
          // Event not found or not deleted successfully
          return {
            statusCode: 404,
            body: JSON.stringify({ error: 'Event not found or not deleted successfully' }),
          };
        }
      } catch (error) {
        console.error('Error deleting event:', error);
        return {
          statusCode: 500,
          body: JSON.stringify({ error: 'Server error' }),
        };
      }
    } else if(event.path === '/post_competitions') {
      try {
        const { user_id, title, description, organizer, location, time, date, images, categories, price } = JSON.parse(event.body);

        // Insert data into the competitions table
        const query = 'INSERT INTO competitions (user_id, title, description, organizer, location, event_time, date, images, category, price) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)';
        await pool.query(query, [user_id, title, description, organizer, location, time, date, images, categories, price]);

        return {
          statusCode: 200,
          body: JSON.stringify({ message: 'Competition posted successfully' }),
        };
      } catch (error) {
        console.error('Error executing query', error);
        return {
          statusCode: 500,
          body: JSON.stringify({ error: 'Server error' }),
        };
      }
    } else if(event.path === '/review') {
      try {
        const { name, review, id } = JSON.parse(event.body);

        // Insert data into the reviews table
        const query = 'UPDATE reviews SET general_reviews = general_reviews || $1';
        await pool.query(query, [[{ name, review, id }]]);

        return {
          statusCode: 200,
          body: JSON.stringify({ message: 'Review added successfully' }),
        };
      } catch (error) {
        console.error('Error executing query', error);
        return {
          statusCode: 500,
          body: JSON.stringify({ error: 'Server error' }),
        };
      }
    } else if(event.path === '/participate/:id') {
      try {
        const id = event.pathParameters.id;
        const { name, phoneNumber, username } = JSON.parse(event.body);

        const checkQuery = 'SELECT participants FROM competitions WHERE post_id = $1';
        const checkResult = await pool.query(checkQuery, [id]);
        const participants = checkResult.rows[0]?.participants || [];

        // Check if the user is already a participant
        const isAlreadyParticipant = participants.some(participant => participant.username.toLowerCase() === username.toLowerCase());

        if (isAlreadyParticipant) {
          return {
            statusCode: 400,
            body: JSON.stringify({ error: 'You are already registered for this event!' }),
          };
        }

        // Add the user to the participants array

        // Query to update the 'participants' column in the 'competitions' table
        const updateQuery = `
          UPDATE competitions
          SET participants = participants || $1
          WHERE post_id = $2;
        `;

        // Execute the query using the pool
        await pool.query(updateQuery, [[{ name, username, phone_number: phoneNumber }], id]);

        return {
          statusCode: 200,
          body: JSON.stringify({ message: 'Successfully updated participants' }),
        };
      } catch (error) {
        console.error('Error executing query', error);
        return {
          statusCode: 500,
          body: JSON.stringify({ error: 'Server error' }),
        };
      }
    } else if(event.path === '/newsletter') {
      try {
        const { passedEmail } = JSON.parse(event.body);

        const checkQuery = 'SELECT newsletter_email_list FROM reviews';
        const checkResult = await pool.query(checkQuery);
        const existingEmailList = checkResult.rows[0]?.newsletter_email_list || [];

        // Check if the user is already subscribed
        const isAlreadySubscribed = existingEmailList.some(emailObj => emailObj.email?.toLowerCase() === passedEmail?.toLowerCase());

        if (isAlreadySubscribed) {
          return {
            statusCode: 400,
            body: JSON.stringify({ error: 'You are already subscribed!' }),
          };
        }

        // Update the email list in the database
        const updateQuery = `
          UPDATE reviews
          SET newsletter_email_list = newsletter_email_list || $1`;

        await pool.query(updateQuery, [[{ email: passedEmail }]]);

        return {
          statusCode: 200,
          body: JSON.stringify({ message: 'Successfully updated newsletter email list' }),
        };
      } catch (error) {
        console.error('Error executing query', error);
        return {
          statusCode: 500,
          body: JSON.stringify({ error: 'Server error' }),
        };
      }
    }
  }
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};
