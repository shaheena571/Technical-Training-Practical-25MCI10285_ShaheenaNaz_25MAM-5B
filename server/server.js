// Main file of the backend. Run this to start the server.
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/tasks");

const app = express();

// middlewares
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json()); // so we can read req.body

// routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// simple route to check if server is working
app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;

// connect to database first, then start the server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log("Server running on port " + PORT));
  })
  .catch((err) => {
    console.log("Could not connect to MongoDB:", err.message);
  });
