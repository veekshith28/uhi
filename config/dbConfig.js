const mongoose = require("mongoose");

mongoose.connect('mongodb://127.0.0.1:27017/myapp');

const connection = mongoose.connection;

connection.on("connected", () => {
  console.log("MongoDB connection is successful");
});

connection.on("error", (error) => {
  console.log("Error in MongoDB connection", error);
});

module.exports = mongoose;
