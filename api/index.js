// Import necessary libraries
const express = require('express');
const cors = require('cors');
const axios = require('axios');

// Create an instance of an Express application
const app = express();

// Define the port the server will listen on
const port = process.env.API_PORT || 3000;

// Enable CORS for all origins
app.use(cors());

// Middleware to parse JSON request bodies
app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
  res.send('Hello World from Express API!');
});

// Sample API endpoint
app.get('/greeting', (req, res) => {
  res.json({ message: 'Hello from the API!' });
});

// Endpoint to fetch photos from JSONPlaceholder
// Example URL: /api/photos/10
app.get('/photos/:amount', async (req, res) => {
  const amountParam = req.params.amount;
  const amount = parseInt(amountParam, 10);

  // Validate input
  if (isNaN(amount) || amount <= 0) {
    return res
      .status(400)
      .json({
        error: 'Invalid amount specified. Please provide a positive number.',
      });
  }

  try {
    // Fetch photos using the _limit parameter
    const apiUrl = `https://jsonplaceholder.typicode.com/photos/${amount}`;
    console.log(`Fetching photos from: ${apiUrl}`); // Log for debugging
    const response = await axios.get(apiUrl);

    // Send fetched data back to the client
    res.json(response.data);
  } catch (error) {
    // Handle errors during the external API call
    console.error('Error fetching photos from JSONPlaceholder:', error.message);
    if (error.response) {
      // External API responded with an error status
      res.status(error.response.status).json({
        error: 'Failed to fetch photos from external API.',
        details: error.response.data,
      });
    } else if (error.request) {
      // Request made but no response received
      res
        .status(503)
        .json({ error: 'No response received from external photo service.' });
    } else {
      // Other errors (e.g., setting up the request)
      res
        .status(500)
        .json({ error: 'Internal server error while fetching photos.' });
    }
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Express server listening at http://localhost:${port}`);
  console.log(`Try accessing: http://localhost:${port}/api/photos/5`);
});
