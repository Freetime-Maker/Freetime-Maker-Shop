const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

// Serve all static files from root
app.use(express.static(path.join(__dirname), {
  maxAge: '1d',
  index: false  // Don't auto-serve index.html for directories
}));

// Serve HTML files directly (don't fallback to index.html)
app.get(/\.html$/, (req, res, next) => {
  const filePath = path.join(__dirname, req.path);
  if (fs.existsSync(filePath)) {
    return res.sendFile(filePath);
  }
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

module.exports = app;module.exports = app;