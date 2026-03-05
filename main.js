const express = require('express');
const path = require('path');

const app = express();

// Serve static files from the root directory
app.use(express.static(path.join(__dirname, '..')));

// For any other route, serve index.html (SPA fallback)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

module.exports = app;