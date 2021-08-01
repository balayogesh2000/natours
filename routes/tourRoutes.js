const express = require("express");
const tourControllers = require("../controllers/tourController");
const authControllers = require("../controllers/authController");

const toursRouter = express.Router();

toursRouter.route("/get-tour-stats").get(tourControllers.getTourStats);

toursRouter
  .route("/top-5-tours")
  .get(
    authControllers.protect,
    tourControllers.aliasTopTours,
    tourControllers.getAllTours
  );

toursRouter
  .route("/get-monthly-plan/:year")
  .get(authControllers.protect, tourControllers.getMonthlyPlan);

toursRouter
  .route("/")
  .get(authControllers.protect, tourControllers.getAllTours)
  .post(authControllers.protect, tourControllers.createTour);
toursRouter
  .route("/:id")
  .get(authControllers.protect, tourControllers.getTour)
  .patch(authControllers.protect, tourControllers.updateTour)
  .delete(
    authControllers.protect,
    authControllers.restrictTo("admin", "lead-guide"),
    tourControllers.deleteTour
  );

module.exports = toursRouter;
