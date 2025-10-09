const express = require("express");
const nodemailer = require("nodemailer");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = 3000;

// View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Parse form data
app.use(express.urlencoded({ extended: true }));

// Nodemailer transporter (uses .env)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false otherwise
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// (Optional) verify SMTP on start
transporter.verify((err, success) => {
  if (err) console.error("SMTP error:", err.message);
  else console.log("✅ SMTP ready");
});

// Helpers
const isEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase());

// Routes
app.get("/", (req, res) => {
  res.render("index", {
    formData: { name: "", email: "", message: "" },
    errors: [],
    success: null,
  });
});

app.post("/contact", async (req, res) => {
  const { name = "", email = "", message = "" } = req.body;
  const formData = { name: name.trim(), email: email.trim(), message: message.trim() };
  const errors = [];

  // Validate inputs (server-side only)
  if (!formData.name) errors.push("Name is required.");
  if (!formData.email) errors.push("Email is required.");
  else if (!isEmail(formData.email)) errors.push("Enter a valid email address.");
  if (!formData.message) errors.push("Message cannot be empty.");
  if (formData.message.length > 2000) errors.push("Message is too long (max 2000 characters).");

  if (errors.length) {
    return res.status(400).render("index", { formData, errors, success: null });
  }

  try {
    await transporter.sendMail({
      from: `${formData.name} <${process.env.FROM_EMAIL || process.env.SMTP_USER}>`,
      to: process.env.TO_EMAIL,
      replyTo: formData.email,
      subject: `New portfolio message from ${formData.name}`,
      text: `From: ${formData.name} (${formData.email})\n\n${formData.message}`,
      html: `
        <div>
          <p><strong>From:</strong> ${formData.name} (${formData.email})</p>
          <p><strong>Message:</strong></p>
          <p style="white-space:pre-wrap">${formData.message}</p>
        </div>`,
    });

    return res.render("index", {
      formData: { name: "", email: "", message: "" },
      errors: [],
      success: "✅ Your message has been sent successfully!",
    });
  } catch (err) {
    console.error("Send error:", err.message);
    return res.status(500).render("index", {
      formData,
      errors: ["❌ Could not send your message. Please try again later."],
      success: null,
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
