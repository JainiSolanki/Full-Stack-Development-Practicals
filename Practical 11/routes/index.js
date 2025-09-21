const express = require("express");
const router = express.Router();

// Root route - redirect to home
router.get("/", (req, res) => {
  res.redirect("/home");
});

// Home route - Dashboard page
router.get("/home", (req, res) => {
  const currentDate = new Date().toLocaleDateString();
  const currentTime = new Date().toLocaleTimeString();

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Dashboard - Express Template</title>
        <link rel="stylesheet" href="/css/style.css">
    </head>
    <body>
        <div class="container">
            <header>
                <h1>Welcome to Express Dashboard</h1>
                <p class="subtitle">Your project template is ready!</p>
            </header>
            
            <main>
                <div class="greeting-card">
                    <h2>Hello, Team! 👋</h2>
                    <p>This is your basic Express.js application template.</p>
                    <p>You can use this as the foundation for building web applications.</p>
                </div>
                
                <div class="info-section">
                    <h3>Server Information</h3>
                    <div class="info-grid">
                        <div class="info-item">
                            <strong>Date:</strong> ${currentDate}
                        </div>
                        <div class="info-item">
                            <strong>Time:</strong> ${currentTime}
                        </div>
                        <div class="info-item">
                            <strong>Status:</strong> Server Running
                        </div>
                        <div class="info-item">
                            <strong>Environment:</strong> Development
                        </div>
                    </div>
                </div>
                
                <div class="next-steps">
                    <h3>Next Steps</h3>
                    <ul>
                        <li>Add more routes in the <code>routes/</code> directory</li>
                        <li>Customize the styling in <code>public/css/style.css</code></li>
                        <li>Add JavaScript functionality in <code>public/js/main.js</code></li>
                        <li>Install additional middleware as needed</li>
                        <li>Set up database connections</li>
                        <li>Add authentication and authorization</li>
                    </ul>
                </div>
            </main>
            
            <footer>
                <p>Express.js Template v1.0 - Ready for Development</p>
            </footer>
        </div>
        
        <script src="/js/main.js"></script>
    </body>
    </html>
  `);
});

// API route example
router.get("/api/status", (req, res) => {
  res.json({
    status: "success",
    message: "API is working",
    timestamp: new Date().toISOString(),
    server: "Express.js Template",
  });
});

module.exports = router;
