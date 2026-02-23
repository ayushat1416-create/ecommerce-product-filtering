const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const productRoutes = require("./src/routes/productRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // parses JSON body

// Routes
app.use("/api/products", productRoutes);

// Health check
app.get("/", (req, res) => res.send("API is running ✅"));

// DB + Server start
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected ✅");
    app.listen(process.env.PORT, () => {
      console.log(`Server running on http://localhost:${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("Mongo error:", err);
  });
