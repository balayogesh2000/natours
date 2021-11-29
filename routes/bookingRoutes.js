const express = require("express");
const authControllers = require("../controllers/authController");
const bookingController = require("../controllers/bookingController");

const router = express.Router();

router.get(
  "/checkout-session/:tourId",
  authControllers.protect,
  bookingController.getCheckoutSession
);

module.exports = router;
