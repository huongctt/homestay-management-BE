const express = require("express");

const serviceController = require("../app/controllers/ServiceController");

const router = express.Router();

router.post("", serviceController.postCreate);

router.delete("/:id", serviceController.delete);
router.patch("/:id", serviceController.postUpdate);

router.get("/:id", serviceController.getService);

module.exports = router;
