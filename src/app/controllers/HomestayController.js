const express = require("express");
const Homestay = require("../models/homestay.js");
const User = require("../models/user.js");
const Review = require("../models/review.js");
const sharp = require("sharp");

class HomestayController {
  async create(req, res) {
    const homestay = new Homestay({
      ...req.body,
      owner: req.user._id,
    });
    if (req.files) {
      for (let i = 0; i < req.files.length; i++) {
        const buffer = await sharp(req.files[i].buffer)
          .resize({ width: 550, height: 500 })
          .png()
          .toBuffer();
        homestay.images.push(buffer);
      }
    }
    try {
      await homestay.save();
      res.status(201).send(homestay);
    } catch (e) {
      res.status(400).send(e);
      console.log("Error: " + e);
    }
  }

  async uploadFiles(req, res) {
    const homestay = await Homestay.findById(req.params.id);
    if (req.files) {
      for (let i = 0; i < req.files.length; i++) {
        const buffer = await sharp(req.files[i].buffer)
          .resize({ width: 550, height: 500 })
          .png()
          .toBuffer();
        homestay.images.push(buffer);
      }
    }
    try {
      await homestay.save();
      res.status(201).send(homestay);
    } catch (e) {
      res.status(400).send(e);
      console.log("Error: " + e);
    }
  }

  async getImage(req, res) {
    try {
      const homestay = await Homestay.findById(req.params.id);
      if (!homestay || homestay.images.length == 0) {
        throw new Error();
      } else {
        res.set("Content-Type", "image/png");
        res.send(homestay.images[req.query.index]);
      }
    } catch (e) {
      res.status(404).send();
      console.log(e);
    }
  }

  async getHomestay(req, res) {
    try {
      const homestay = await Homestay.findById(req.params.id);
      if (!homestay) {
        throw new Error();
      } else {
        const owner = await User.findById(homestay.owner);
        await owner
          .populate({
            path: "homestays",
          })
          .execPopulate();
        // const reviews = await Review.find({ homestay: req.params.id });
        // var totalStar = 0;
        // var averageRate = 0;
        // var totalGuests = 0;
        // for (var review of reviews) {
        //   await review
        //     .populate({
        //       path: "user",
        //     })
        //     .execPopulate();
        //   totalStar += review.rate;
        // }
        // if (reviews.length != 0) {
        //   averageRate = totalStar / reviews.length;
        // }
        // const guests = await Booking.aggregate([
        //   {
        //     $match: {
        //       homestay: ObjectId(req.params.id),
        //       status: { $in: ["stayed", "reviewed"] },
        //     },
        //   },
        //   {
        //     $group: {
        //       _id: { _id: ObjectId(req.params.id) },
        //       total: { $sum: "$people" },
        //     },
        //   },
        // ]);
        // if (guests.length != 0) {
        //   totalGuests = guests[0].total;
        // }

        // reviews.sort((a, b) => b.createdAt - a.createdAt);
        res.send({
          homestay: homestay,
          owner: owner,
          // reviews: reviews,
          // averageRate,
          // totalGuests,
        });
      }
    } catch (e) {
      res.status(404).send();
      console.log(e);
    }
  }

  async update(req, res) {
    const updates = Object.keys(req.body);
    const homestay = await Homestay.findById(req.params.id);
    try {
      updates.forEach((update) => (homestay[update] = req.body[update]));
      await homestay.save();
      res.status(200).send(homestay);
    } catch (e) {
      res.status(400).send(e);
    }
  }

  async delete(req, res) {
    try {
      const homestay = await Homestay.findByIdAndDelete({
        _id: req.params.id,
        owner: req.user._id,
      });
      if (!homestay) {
        return res.status(404).send();
      }
      res.status(200).send({
        message: "delete successfully",
      });
    } catch (e) {
      res.status(400).send();
    }
  }

  async getList(req, res) {
    try {
      const homestays = await Homestay.find({ owner: req.query.userid });
      res.status(200).send({ homestays: homestays });
    } catch (e) {
      res.status(400).send();
    }
  }
}

module.exports = new HomestayController();
