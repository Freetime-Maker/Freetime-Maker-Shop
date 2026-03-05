const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

// Serve static files from the current directory
app.use(express.static(__dirname));

// For any other route, serve index.html (SPA fallback)
app.get(/.*/, (req, res) => {
  const filePath = path.join(__dirname, req.path);
  
  // Check if the requested file exists
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    return res.sendFile(filePath);
  }
  
  // Otherwise serve index.html
  res.sendFile(path.join(__dirname, 'index.html'));
});

module.exports = app;