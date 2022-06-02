const express = require('express');
const staticPagesController = require('../app/controllers/StaticPagesController');

const router = express.Router();

router.get('/', staticPagesController.home);

module.exports = router;
