const express = require("express");
const HomestayController = require("../app/controllers/HomestayController");
const auth = require("../app/middleware/auth");
const multer = require("multer");

const router = express.Router();

const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Please update an image"));
    }
    cb(undefined, true);
  },
});
//create
router.post("", upload.array("image"), HomestayController.create);
//update
router.patch("/update", HomestayController.update);
//get homestay
router.get("/:id", auth, HomestayController.getHomestay);
//get image ?index=1
router.get(":id/images", auth, HomestayController.getHomestay);

module.exports = router;
