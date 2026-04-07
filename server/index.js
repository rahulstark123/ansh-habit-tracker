require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const habitRoutes = require("./routes/habits");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Avoid noisy 404s from browser favicon probes on API domain.
app.get("/favicon.png", (_req, res) => {
  res.status(204).end();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/habits", habitRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ status: "Ansh Habit Tracker API is running 🚀" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
