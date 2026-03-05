const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

// Serve static files from public folder
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '1d'
}));

// Serve style.css and images from root as well (for backward compatibility)
app.use('/style.css', express.static(path.join(__dirname, 'style.css')));
app.use('/images', express.static(path.join(__dirname, 'images')));

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