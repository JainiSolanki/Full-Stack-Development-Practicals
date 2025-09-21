const express = require("express");
const path = require("path");

// Create Express application
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Import routes
const indexRoutes = require("./routes/index");

// Use routes
app.use("/", indexRoutes);

// 404 Error Handler
app.use((req, res) => {
  res.status(404).send(`
    <html>
      <head>
        <title>Page Not Found</title>
        <link rel="stylesheet" href="/css/style.css">
      </head>
      <body>
        <div class="container">
          <h1>404 - Page Not Found</h1>
          <p>The page you are looking for does not exist.</p>
          <a href="/home">Go to Home</a>
        </div>
      </body>
    </html>
  `);
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send(`
    <html>
      <head>
        <title>Server Error</title>
        <link rel="stylesheet" href="/css/style.css">
      </head>
      <body>
        <div class="container">
          <h1>500 - Server Error</h1>
          <p>Something went wrong on our end.</p>
          <a href="/home">Go to Home</a>
        </div>
      </body>
    </html>
  `);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Visit http://localhost:${PORT}/home to see the dashboard`);
});

module.exports = app;
