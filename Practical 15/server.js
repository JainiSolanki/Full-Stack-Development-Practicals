const express = require("express");
const session = require("express-session");
const path = require("path");

const app = express();
const PORT = 3000;

// View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Parse form data
app.use(express.urlencoded({ extended: true }));

// Sessions
app.use(
  session({
    name: "lib.sid",                 // cookie name
    secret: "change-this-secret",    // 🔐 change in real apps
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 60 * 60 * 1000 // 1 hour
    }
  })
);

// Simple auth guard
function ensureLoggedIn(req, res, next) {
  if (req.session.user) return next();
  return res.redirect("/");
}

// Routes
app.get("/", (req, res) => {
  if (req.session.user) return res.redirect("/profile");
  res.render("login", { error: null, namePrefill: "" });
});

app.post("/login", (req, res) => {
  const name = (req.body.name || "").trim();
  if (!name) {
    return res.status(400).render("login", {
      error: "Please enter your name.",
      namePrefill: req.body.name || ""
    });
  }
  req.session.user = {
    name,
    loginTime: Date.now()
  };
  res.redirect("/profile");
});

app.get("/profile", ensureLoggedIn, (req, res) => {
  const { name, loginTime } = req.session.user;
  const loginAt = new Date(loginTime).toLocaleString("en-IN", { hour12: true });
  res.render("profile", { name, loginAt });
});

app.post("/logout", ensureLoggedIn, (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).send("Logout failed. Try again.");
    res.clearCookie("lib.sid");
    res.redirect("/");
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
