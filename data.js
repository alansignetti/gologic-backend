const rooms = [
  {
    id: 1,
    title: "Cozy Studio Apartment",
    images: ["room1.webp", "room3.jpg"],
    price: 75,
    description: "A charming studio apartment perfect for a weekend getaway...",
    address: "123 Main St, Anytown, CA",
    capacity: 2,
  },
  {
    id: 2,
    title: "Spacious Family Suite",
    images: ["room2.webp", "room4.jpg"],
    price: 120,
    description: "A comfortable suite ideal for families or groups...",
    address: "456 Elm St, Anytown, CA",
    capacity: 4,
  },
  {
    id: 3,

    title: "Room 3",
    images: ["room3.jpg", "room4.jpg"],
    price: 120,
    description: "Room 3",
    address: "456 Elm St, Anytown, CA",
    capacity: 4,
  },
];

const mockBookingRequest = [
  {
    bookingRequest: 12345,
    room: rooms[0], // Reference room object from rooms array
    checkinDate: new Date("2024-03-10"),
    checkoutDate: new Date("2024-03-14"),
  },
  {
    bookingRequest: Math.random(),
    room: rooms[1], // Reference room object from rooms array
    checkinDate: new Date("2024-03-20"),
    checkoutDate: new Date("2024-03-25"),
  },
];

module.exports = { rooms, mockBookingRequest }; // Export both objects
