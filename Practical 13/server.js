const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// Routes
app.get("/", (req, res) => {
  res.render("form");
});

app.post("/calculate", (req, res) => {
  let { income1, income2 } = req.body;

  // Validation
  income1 = parseFloat(income1);
  income2 = parseFloat(income2);

  if (isNaN(income1) || isNaN(income2) || income1 < 0 || income2 < 0) {
    return res.render("result", { error: "Please enter valid positive numbers.", total: null });
  }

  const total = income1 + income2;
  res.render("result", { total, error: null });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
