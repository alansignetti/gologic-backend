const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  images: [
    {
      type: String,
      required: true,
    },
  ],
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
    validate: {
      validator: function (capacity) {
        return capacity > 0; // Ensure capacity is positive
      },
      message: "Capacity must be a positive number",
    },
  },
});

module.exports = mongoose.model("Room", roomSchema);
