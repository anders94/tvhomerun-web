const express = require('express');
const path = require('path');

const app = express();
const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 8080;

// Get backend URL from command line argument or environment variable
// Usage: node server.js http://192.168.1.100:3000
const BACKEND_URL = process.argv[2] || process.env.BACKEND_URL || 'http://localhost:3000';

// Middleware to parse JSON
app.use(express.json());

// Serve static files from the public directory
app.use(express.static('public'));

// API endpoint to get configuration
app.get('/api/config', (req, res) => {
  res.json({
    backendURL: BACKEND_URL
  });
});

// Route for the root path - serve shows page directly
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'shows.html'));
});

// Error handlers for uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start the server
const server = app.listen(PORT, HOST, () => {
  console.log(`TVHomeRun Web Server running on http://${HOST}:${PORT}`);
  console.log(`Backend URL configured as: ${BACKEND_URL}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Error: Port ${PORT} is already in use`);
  } else if (err.code === 'EACCES') {
    console.error(`Error: Permission denied to bind to port ${PORT}`);
  } else {
    console.error('Server error:', err);
  }
  process.exit(1);
});
