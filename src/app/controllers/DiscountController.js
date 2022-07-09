const express = require("express");
const User = require("../models/user.js");
const Homestay = require("../models/homestay.js");
const Discount = require("../models/discount.js");
const auth = require("../middleware/auth.js");
class DiscountController {
  async create(req, res) {
    try {
      const discount = new Discount({
        ...req.body,
        user: req.user,
      });
      discount.homestay = [];
      req.body.homestays.forEach((homestay) => {
        discount.homestay.push(homestay);
      });
      await discount.save();
      res.status(201).send({ discount });
    } catch (e) {
      res.status(400).send(e);
    }
  }

  async getAll(req, res) {
    try {
      const discounts = await Discount.find({ user: req.user._id });
      const date = new Date();

      const { activeDiscounts, inactiveDiscounts } = discounts.reduce(
        (a, i) => {
          if (i.checkout >= date) {
            a.activeDiscounts.push(i);
          } else {
            a.inactiveDiscounts.push(i);
          }
          return a;
        },
        {
          activeDiscounts: [],
          inactiveDiscounts: [],
        }
      );
      res.status(200).send({ activeDiscounts, inactiveDiscounts });
    } catch (e) {
      res.status(400).send(e);
      console.log(e);
    }
  }

  async getDiscountByHomestay(req, res) {
    try {
      const date = new Date();
      const discounts = await Discount.find({
        homestay: { $elemMatch: req.params.homestay },
        checkout: { $lte: date },
      });

      res.status(200).send({ discounts });
    } catch (e) {
      res.status(400).send(e);
      console.log(e);
    }
  }
}
module.exports = new DiscountController();
