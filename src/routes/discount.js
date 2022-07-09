const express = require("express");

const discountController = require("../app/controllers/DiscountController");
const auth = require("../app/middleware/auth");

const router = express.Router();

router.post("/", auth, discountController.create);

router.get("/", auth, discountController.getAll);

module.exports = router;
