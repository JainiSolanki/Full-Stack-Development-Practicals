const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

// Ensure uploads directory exists
const UPLOAD_DIR = path.join(__dirname, "uploads");
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// Static files (serves our form)
app.use(express.static(path.join(__dirname, "public")));

// Multer storage: save PDFs in /uploads with a timestamped filename
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const safeBase = path.parse(file.originalname).name.replace(/[^\w\-]+/g, "_");
    cb(null, `${Date.now()}_${safeBase}.pdf`);
  },
});

// Allow only PDFs and limit size to 2 MB
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    const isPdfMime = file.mimetype === "application/pdf";
    const isPdfExt = path.extname(file.originalname).toLowerCase() === ".pdf";
    if (isPdfMime && isPdfExt) return cb(null, true);
    cb(new Error("Only PDF files are allowed."));
  },
});

// Friendly HTML response helper
function respond(res, { title = "Upload Result", message = "", ok = false }) {
  res
    .status(ok ? 200 : 400)
    .send(`
      <!doctype html>
      <html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
      <title>${title}</title>
      <style>
        body{margin:0;font-family:Arial, sans-serif;background:#f5f7fb;min-height:100vh;display:grid;place-items:center}
        .card{width:360px;max-width:92vw;background:#fff;color:#222;padding:24px;border-radius:12px;box-shadow:0 8px 24px rgba(0,0,0,.12);text-align:center}
        h1{font-size:20px;margin:0 0 10px}
        p{margin:8px 0 16px}
        a{display:inline-block;margin-top:8px;color:#007bff;text-decoration:none}
        a:hover{text-decoration:underline}
        .ok{color:#1b7c28;font-weight:bold}
        .err{color:#c62828;font-weight:bold}
      </style></head>
      <body>
        <div class="card">
          <h1>${title}</h1>
          <p class="${ok ? "ok" : "err"}">${message}</p>
          <a href="/">← Back to upload</a>
        </div>
      </body></html>
    `);
}

// Upload route (single file named "resume")
app.post("/upload", (req, res) => {
  upload.single("resume")(req, res, (err) => {
    // Multer-specific errors (e.g., file too big)
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return respond(res, {
          title: "Upload Failed",
          message: "File too large. Maximum allowed size is 2 MB.",
          ok: false,
        });
      }
      return respond(res, { title: "Upload Failed", message: err.message, ok: false });
    }

    // Other errors from our fileFilter or unexpected issues
    if (err) {
      return respond(res, { title: "Upload Failed", message: err.message, ok: false });
    }

    // No file uploaded
    if (!req.file) {
      return respond(res, {
        title: "Upload Failed",
        message: "Please select a PDF file to upload.",
        ok: false,
      });
    }

    // Success!
    return respond(res, {
      title: "Upload Successful",
      message: `Your resume was uploaded successfully as "${path.basename(req.file.path)}".`,
      ok: true,
    });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
