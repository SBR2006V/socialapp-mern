require("dotenv").config();

const express = require("express");

const cors = require("cors");

const dotenv = require("dotenv");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");

const postRoutes = require("./routes/postRoutes");

// connect database
connectDB();

const app = express();

// middleware
app.use(cors());

app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/posts", postRoutes);

// test route
app.get("/", (req, res) => {
  res.send("API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
