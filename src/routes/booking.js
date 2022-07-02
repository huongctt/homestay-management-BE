const express = require("express");

const bookingController = require("../app/controllers/BookingController");
const auth = require("../app/middleware/auth");

const router = express.Router();

router.post("/search", bookingController.search);
router.post("/bookings/:id", auth, bookingController.book);
router.get(
  "/bookings/homestay/:homestayId",
  auth,
  bookingController.getBookingByHomestay
);
module.exports = router;
