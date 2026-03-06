const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

// Handle all routes - check if file exists first
app.use((req, res, next) => {
  const filePath = path.join(__dirname, req.path);
  
  // If it's a file that exists, serve it
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    return res.sendFile(filePath);
  }
  
  // Otherwise continue to next middleware
  next();
});

// Fallback: serve index.html for other routes
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// For local testing
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;