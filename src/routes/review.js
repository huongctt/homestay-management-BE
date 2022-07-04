const express = require("express");

const reviewController = require("../app/controllers/ReviewController");
const auth = require("../app/middleware/auth");

const router = express.Router();

router.post("/:bookingId", auth, reviewController.create);

router.get("/:homestayId", reviewController.getAllByHomestayId);

module.exports = router;
