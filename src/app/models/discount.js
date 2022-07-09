const mongoose = require("mongoose");

const Schema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    homestay: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Homestay",
      },
    ],
    quantity: {
      type: Number,
    },
    used: {
      type: Number,
    },
    percentage: {
      type: Number,
    },
    checkin: {
      type: Date,
      required: true,
    },
    checkout: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Discount = mongoose.model("Discount", Schema);

module.exports = Discount;
