const mongoose = require("mongoose");
require("dotenv").config();

// MongoDB connection URL
const mongoURI = process.env.MONGODB_URI;

// Connect to MongoDB

exports.connect = () => {
  mongoose
    .connect(mongoURI)
    .then(() => console.log("Database Connected Successfully"))
    .catch((err) => console.log(err));
};
