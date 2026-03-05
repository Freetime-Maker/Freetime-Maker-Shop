const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

// Serve static files with explicit handling
app.use((req, res, next) => {
  const filePath = path.join(__dirname, req.path);
  
  // Try to serve the file if it exists
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    // Set correct content types
    if (req.path.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    } else if (req.path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    } else if (req.path.endsWith('.png')) {
      res.setHeader('Content-Type', 'image/png');
    } else if (req.path.endsWith('.ico')) {
      res.setHeader('Content-Type', 'image/x-icon');
    }
    return res.sendFile(filePath);
  }
  
  next();
});

// Fallback: serve index.html
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

module.exports = app;module.exports = app;