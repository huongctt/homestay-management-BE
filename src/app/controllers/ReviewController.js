const express = require("express");
const Homestay = require("../models/homestay.js");
const User = require("../models/user.js");
const Review = require("../models/review.js");
const Booking = require("../models/booking.js");

class ReviewController {
  async create(req, res) {
    try {
      const booking = await Booking.findById(req.params.bookingId);
      const review = new Review({
        ...req.body,
        homestay: booking.homestay,
        user: req.user,
      });
      await review.save();
      booking.status = "reviewed";
      await booking.save();
      res.status(201).send({ review });
    } catch (e) {
      res.status(400).send(e);
    }
  }

  async getAllByHomestayId(req, res) {
    try {
      const reviews = await Review.find({ homestay: req.params.homestayId });
      let avg = 0;
      let total = 0;
      for (let i = 0; i < reviews.length; i++) {
        await reviews[i]
          .populate({
            path: "user",
          })
          .execPopulate();
        total += reviews[i].rate;
      }
      avg = total / reviews.length;
      reviews.sort((a, b) => b.createdAt - a.createdAt);
      res.status(200).send({ reviews, averageStar: avg });
    } catch (e) {
      res.status(400).send(e);
      console.log(e);
    }
  }
}

module.exports = new ReviewController();
