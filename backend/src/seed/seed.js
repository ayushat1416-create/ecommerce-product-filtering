const mongoose = require("mongoose");
require("dotenv").config();
const Product = require("../models/Product");

const sampleProducts = [
  { title: "iPhone 14", price: 59999, category: "Electronics" },
  { title: "Bluetooth Headphones", price: 1999, category: "Electronics" },
  { title: "Men T-Shirt", price: 499, category: "Fashion" },
  { title: "Women Sneakers", price: 2499, category: "Fashion" },
  { title: "Coffee Maker", price: 3499, category: "Home" },
  { title: "Office Chair", price: 8999, category: "Home" },
  { title: "Gaming Mouse", price: 1499, category: "Electronics" },
  { title: "Jeans", price: 1599, category: "Fashion" },
  { title: "Water Bottle", price: 299, category: "Home" }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("DB connected ✅");

    await Product.deleteMany({});
    await Product.insertMany(sampleProducts);

    console.log("Seed complete ✅");
    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
}

seed();
