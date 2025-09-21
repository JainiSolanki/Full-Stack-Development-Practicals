const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// Serve static files
app.use(express.static("public"));

// Home page - list all log files
app.get("/", (req, res) => {
  const logsDir = path.join(__dirname, "logs");

  fs.readdir(logsDir, (err, files) => {
    if (err) {
      return res.status(500).send(`
        <html>
          <head>
            <title>Log Viewer - Error</title>
            <link rel="stylesheet" href="/style.css">
          </head>
          <body>
            <div class="container">
              <h1>Error</h1>
              <p class="error">Cannot access logs directory: ${err.message}</p>
              <a href="/" class="btn">Try Again</a>
            </div>
          </body>
        </html>
      `);
    }

    // Filter only .txt and .log files
    const logFiles = files.filter(
      (file) => file.endsWith(".txt") || file.endsWith(".log")
    );

    let fileList = "";
    if (logFiles.length === 0) {
      fileList = '<p class="no-files">No log files found</p>';
    } else {
      fileList = '<ul class="file-list">';
      logFiles.forEach((file) => {
        fileList += `<li><a href="/logs/${file}" class="file-link">${file}</a></li>`;
      });
      fileList += "</ul>";
    }

    res.send(`
      <html>
        <head>
          <title>Log Viewer</title>
          <link rel="stylesheet" href="/style.css">
        </head>
        <body>
          <div class="container">
            <h1>Log File Viewer</h1>
            <p class="subtitle">Select a log file to view its contents:</p>
            ${fileList}
          </div>
        </body>
      </html>
    `);
  });
});

// View specific log file
app.get("/logs/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, "logs", filename);

  // Security check - prevent directory traversal
  if (
    filename.includes("..") ||
    filename.includes("/") ||
    filename.includes("\\")
  ) {
    return res.status(400).send(`
      <html>
        <head>
          <title>Log Viewer - Error</title>
          <link rel="stylesheet" href="/style.css">
        </head>
        <body>
          <div class="container">
            <h1>Invalid File Name</h1>
            <p class="error">Invalid file name provided</p>
            <a href="/" class="btn">Back to File List</a>
          </div>
        </body>
      </html>
    `);
  }

  // Check if file exists and read it
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      let errorMessage = "Unknown error occurred";
      let statusCode = 500;

      if (err.code === "ENOENT") {
        errorMessage = `File "${filename}" not found`;
        statusCode = 404;
      } else if (err.code === "EACCES") {
        errorMessage = `Permission denied to read "${filename}"`;
        statusCode = 403;
      } else if (err.code === "EISDIR") {
        errorMessage = `"${filename}" is a directory, not a file`;
        statusCode = 400;
      }

      return res.status(statusCode).send(`
        <html>
          <head>
            <title>Log Viewer - Error</title>
            <link rel="stylesheet" href="/style.css">
          </head>
          <body>
            <div class="container">
              <h1>Error Reading File</h1>
              <p class="error">${errorMessage}</p>
              <p class="error-details">Error Code: ${err.code}</p>
              <a href="/" class="btn">Back to File List</a>
            </div>
          </body>
        </html>
      `);
    }

    // Format the file content
    const formattedContent = data
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\n/g, "<br>");

    // Count lines
    const lineCount = data.split("\n").length;

    res.send(`
      <html>
        <head>
          <title>Log Viewer - ${filename}</title>
          <link rel="stylesheet" href="/style.css">
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Log File: ${filename}</h1>
              <div class="file-info">
                <span class="info-item">Lines: ${lineCount}</span>
                <span class="info-item">Size: ${Buffer.byteLength(
                  data,
                  "utf8"
                )} bytes</span>
              </div>
            </div>
            <div class="actions">
              <a href="/" class="btn">Back to File List</a>
              <button onclick="window.location.reload()" class="btn btn-refresh">Refresh</button>
            </div>
            <div class="log-content">
              <pre>${formattedContent || "<em>File is empty</em>"}</pre>
            </div>
          </div>
        </body>
      </html>
    `);
  });
});

// Handle 404 for other routes
app.use((req, res) => {
  res.status(404).send(`
    <html>
      <head>
        <title>Log Viewer - Not Found</title>
        <link rel="stylesheet" href="/style.css">
      </head>
      <body>
        <div class="container">
          <h1>Page Not Found</h1>
          <p class="error">The requested page could not be found</p>
          <a href="/" class="btn">Back to Home</a>
        </div>
      </body>
    </html>
  `);
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500).send(`
    <html>
      <head>
        <title>Log Viewer - Server Error</title>
        <link rel="stylesheet" href="/style.css">
      </head>
      <body>
        <div class="container">
          <h1>Server Error</h1>
          <p class="error">An internal server error occurred</p>
          <a href="/" class="btn">Back to Home</a>
        </div>
      </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`Log Viewer running on http://localhost:${PORT}`);
  console.log('Place your log files in the "logs" directory');
});
