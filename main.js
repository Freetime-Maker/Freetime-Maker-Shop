const express = require('express');
const path = require('path');

const app = express();

// Serve static files - include the root directory where files are
const staticOptions = {
  maxAge: '1d',
  etag: false
};

app.use(express.static(path.join(__dirname), staticOptions));

// For any other route, serve index.html (SPA fallback)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

module.exports = app;module.exports = app;