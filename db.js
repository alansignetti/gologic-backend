const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://gologic:fP8meeAb7EwDC88v@gologic.wjzihvr.mongodb.net/gologicbd"
);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));

db.once("open", function () {
  console.log("Connected to MongoDB");
});

module.exports = db;
