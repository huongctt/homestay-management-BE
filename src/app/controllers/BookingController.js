const express = require("express");
const Homestay = require("../models/homestay.js");
const User = require("../models/user.js");
const Review = require("../models/review.js");
const Booking = require("../models/booking.js");
const sharp = require("sharp");

class BookingController {
  async search(req, res) {
    try {
      const checkintime = req.body.checkin;
      const checkouttime = req.body.checkout;
      const booked = await Booking.find({
        $or: [
          { checkin: { $gte: checkintime, $lte: checkouttime } },
          {
            checkout: { $gte: checkintime, $lte: checkouttime },
          },
          {
            $and: [
              { checkin: { $lte: checkintime } },
              { checkout: { $gte: checkouttime } },
            ],
          },
        ],
        status: { $in: ["accepted", "stayed", "reviewed"] },
      });
      var unavailable = [];
      for (var i = 0; i < booked.length; i++) {
        unavailable.push(booked[i].homestay);
      }
      const homestays = await Homestay.find({
        city: req.body.city,
        price: { $gte: 0, $lte: req.body.price },
        _id: { $nin: unavailable },
      });
      res.status(200).send({ user: req.user, homestays });
    } catch (e) {
      res.status(400).send(e);
    }
  }

  async book(req, res) {
    try {
      const homestay = await Homestay.findById(req.params.id);
      const booking = new Booking({
        ...req.body,
        user: req.user._id,
        homestay: homestay._id,
        status: "requested",
      });
      var datecheckin = new Date(req.body.checkin);
      var datecheckout = new Date(req.body.checkout);
      var date = (datecheckout - datecheckin) / (60 * 60 * 24 * 1000);
      booking.money = homestay.price * date;
      console.log({ booking });
      await booking.save();
      res.status(201).send({ booking });
    } catch (e) {
      res.status(400).send(e);
      console.log({ e });
    }
  }

  async getBookingByHomestay(req, res) {
    const homestay = await Homestay.findById(req.params.homestayId);
    var bookingList = [];
    var date;
    const tab = req.query.tab;

    if (req.query.username && req.query.time) {
      var username = req.query.username;
      if (req.query.time == "thisweek") {
        date = new Date(new Date() - 7 * 60 * 60 * 24 * 1000);
      } else if (req.query.time == "thismonth") {
        date = new Date(new Date() - 30 * 60 * 60 * 24 * 1000);
      }
      try {
        var users = await User.find({
          name: { $regex: username, $options: "i" },
        });
        var ids = users.map(function (user) {
          return user._id;
        });
        bookingList = await Booking.find({
          homestay: req.params.homestayId,
          status: tab,
          user: { $in: ids },
          createdAt: {
            $lte: new Date(),
            $gte: date,
          },
        });
      } catch (e) {
        res.status(500).send();
        console.log(e);
      }
    } else if (req.query.username) {
      var username = req.query.username;
      try {
        var users = await User.find({
          name: { $regex: username, $options: "i" },
        });
        var ids = users.map(function (user) {
          return user._id;
        });
        bookingList = await Booking.find({
          homestay: req.params.homestayId,
          status: tab,
          user: { $in: ids },
        });
      } catch (e) {
        res.status(500).send();
        console.log(e);
      }
    } else if (req.query.time) {
      if (req.query.time == "thisweek") {
        date = new Date(new Date() - 7 * 60 * 60 * 24 * 1000);
      } else if (req.query.time == "thismonth") {
        date = new Date(new Date() - 30 * 60 * 60 * 24 * 1000);
      }
      bookingList = await Booking.find({
        homestay: req.params.homestayId,
        status: tab,
        createdAt: {
          $lte: new Date(),
          $gte: date,
        },
      });
    } else {
      //requested
      bookingList = await Booking.find({
        homestay: req.params.homestayId,
        status: "requested",
      });
    }
    for (var i = 0; i < bookingList.length; i++) {
      await bookingList[i]
        .populate({
          path: "user",
        })
        .execPopulate();
    }
    res.status(200).send({
      homestay,
      bookingList,
    });
  }
}

module.exports = new BookingController();
