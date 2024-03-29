const express = require("express");
const moment = require("moment");
const bodyParser = require("body-parser");
const app = express();
const db = require("./db");
const Booking = require("./bookingsModel");
const Room = require("./roomModel");
app.use(bodyParser.json());
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {});
app.use(bodyParser.urlencoded({ extended: true }));
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// CORS middleware
function setCommonHeaders(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*"); // Allow all origins (for development)
  res.setHeader("Content-Type", "application/json");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
}

app.use(setCommonHeaders);
// CORS

app.get("/", async (req, res) => {
  res.json("Bakend GoLogic ");
});

app.get("/api/rooms", async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (error) {
    console.error("Error fetching rooms:", error);
    res.status(500).json({ message: "Error retrieving rooms" });
  }
});

app.get("/api/rooms/available", async (req, res) => {
  const { checkInDate, checkOutDate, guestCount } = req.query;
  const rooms = await Room.find();

  if (!checkInDate || !checkOutDate) {
    res.json(rooms);
    console.log("devuelve rooms");
    return;
  }

  const parsedStartDate = moment(checkInDate);
  const parsedEndDate = moment(checkOutDate);

  if (parsedStartDate.isAfter(parsedEndDate)) {
    return res
      .status(400)
      .json({ message: "Start date must be before end date" });
  }

  const bookings = await Booking.find().populate("room");
  const availableRooms = rooms.filter((room) => {
    return (
      !bookings.some((booking) => {
        const bookingCheckIn = moment(booking.checkinDate);
        const bookingCheckout = moment(booking.checkoutDate);

        return (
          booking.room.id === room.id &&
          parsedStartDate.isBefore(bookingCheckout) &&
          parsedEndDate.isAfter(bookingCheckIn)
        );
      }) && room.capacity >= guestCount // Check capacity after availability check
    );
  });

  res.json(availableRooms);
});

app.get("/api/rooms/:id", async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // Allow all origins (for development)
  res.setHeader("Content-Type", "application/json");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, DELETE"
  );
  const roomId = parseInt(req.params.id);
  const roomBD = await Room.find();
  const room = roomBD.find((room) => room.id === roomId);

  if (room) {
    res.json(room);
  } else {
    res.status(404).send("Room not found");
  }
});

app.post("/api/createBooking", async (req, res) => {
  const { roomId, email, checkinDate, checkoutDate, guestCount } = req.body;

  if (!roomId || !email || !checkinDate || !checkoutDate || !guestCount) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const parsedStartDate = moment(checkinDate);
  const parsedEndDate = moment(checkoutDate);

  if (parsedStartDate.isAfter(parsedEndDate)) {
    return res
      .status(400)
      .json({ message: "Start date must be before end date" });
  }

  const roomBD = await Room.find();
  const bookings = await Booking.find().populate("room");
  const bookedRoom = roomBD.filter((room) => {
    return bookings.some((booking) => {
      const bookingCheckIn = moment(booking.checkinDate);
      const bookingCheckout = moment(booking.checkoutDate);
      return (
        (parsedStartDate.isBetween(bookingCheckIn, bookingCheckout) ||
          parsedEndDate.isBetween(bookingCheckIn, bookingCheckout)) &&
        booking.room.id === roomId
      );
    }); // Check capacity after availability check
  });

  if (bookedRoom.length > 0) {
    return res
      .status(409)
      .json({ message: "Room already booked for those dates" });
  }

  // Get room capacity directly from database
  const room = roomBD.find((room) => room.id === roomId);

  if (!room || room.capacity < guestCount) {
    return res.status(400).json({ message: "Insufficient room capacity" });
  }

  // Create and persist booking in database
  const newBooking = new Booking({
    bookingRequest: Date.now(),
    room,
    email,
    checkinDate,
    checkoutDate,
    guestCount,
  });

  try {
    await newBooking.save(); // Save to database
    res.status(201).json({
      message: "Booking created successfully",
      bookingId: newBooking.id,
    });
  } catch (error) {
    console.error("Error saving booking to database:", error);
    res.status(400).json({ message: "Error creating booking" });
  }
});
