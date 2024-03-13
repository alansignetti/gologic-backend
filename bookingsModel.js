const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  bookingRequest: {
    type: Number,
    required: true,
    unique: true,
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
    required: true,
  },
  checkinDate: {
    type: Date,
    required: true,
  },
  checkoutDate: {
    type: Date,
    required: true,
    // validate: {
    //   validator: function (checkoutDate) {
    //     return checkoutDate > this.checkinDate; // La fecha de salida debe ser posterior a la de entrada
    //   },
    //   message: "La fecha de salida debe ser posterior a la de entrada",
    // },
  },
  email: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Booking", bookingSchema);
