const express = require("express");
const moment = require("moment");

const { rooms, mockBookingRequest } = require("./data");
const app = express();

// CORS middleware
function setCommonHeaders(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*"); // Allow all origins (for development)
  res.setHeader("Content-Type", "application/json");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, DELETE"
  );
  next();
}

app.use(setCommonHeaders);
// CORS

app.get("/api/rooms/available", async (req, res) => {
  const { checkInDate, checkOutDate } = req.query; // Access query parameters

  if (!checkInDate || !checkOutDate) {
    res.json(rooms);
    console.log("devuelve rooms");
    return;
  }

  const parsedStartDate = moment(checkInDate); // Specify format
  const parsedEndDate = moment(checkOutDate);

  if (parsedStartDate.isAfter(parsedEndDate)) {
    return res
      .status(400)
      .json({ message: "Start date must be before end date" });
  }
  console.log("parsedStartDate:" + parsedStartDate.format("YYYY-MM-DD"));

  // Filter bookings based on dates to find available rooms
  const bookings = mockBookingRequest;
  const availableRooms = rooms.filter((room) => {
    // Check for any overlapping bookings for this room
    return !bookings.some((booking) => {
      const bookingCheckIn = moment(booking.checkinDate);
      const bookingCheckout = moment(booking.checkoutDate);
      console.log("bookingCheckIn:" + bookingCheckIn.format("YYYY-MM-DD"));
      return (
        // Any overlap between requested dates and existing booking dates:
        (booking.room.id === room.id &&
          parsedStartDate.isSameOrBefore(bookingCheckout) &&
          parsedEndDate.isSameOrAfter(bookingCheckIn)) ||
        (booking.room.id === room.id &&
          parsedStartDate.isSameOrAfter(bookingCheckIn) &&
          parsedStartDate.isSameOrBefore(bookingCheckout)) ||
        (booking.room.id === room.id &&
          parsedEndDate.isSameOrAfter(bookingCheckIn) &&
          parsedEndDate.isSameOrBefore(bookingCheckout))
      );
    });
  });

  res.json(availableRooms);
});

app.get("/api/rooms/:id", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // Allow all origins (for development)
  res.setHeader("Content-Type", "application/json");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, DELETE"
  );
  const roomId = parseInt(req.params.id);
  const room = rooms.find((room) => room.id === roomId);

  if (room) {
    res.json(room);
  } else {
    res.status(404).send("Room not found");
  }
});

app.post("/api/bookings", async (req, res) => {
  const { roomId, checkinDate, checkoutDate, guests } = req.body;

  // Validation (replace with more robust checks)
  if (!roomId || !checkinDate || !checkoutDate || !guests) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  if (isRoomAvailable(roomId, checkinDate, checkoutDate)) {
    if (rooms[roomId - 1].capacity >= guests) {
      // Create booking logic (replace with database persistence)
      const booking = {
        id: Math.random(), // Generate a unique identifier
        room: rooms[roomId - 1],
        checkinDate,
        checkoutDate,
        guests,
      };
      // ... persist booking data (e.g., save to database)

      return res.status(201).json(booking);
    } else {
      return res.status(400).json({ message: "Insufficient room capacity" });
    }
  } else {
    return res
      .status(409)
      .json({ message: "Room unavailable for those dates" });
  }
});

app.listen(3000, () => {
  console.log("Servidor escuchando en el puerto 3000");
});
