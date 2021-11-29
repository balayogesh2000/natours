const express = require("express");
const tourControllers = require("../controllers/tourController");
const authControllers = require("../controllers/authController");
const reviewRouter = require("./reviewRoutes");

const toursRouter = express.Router();

toursRouter.use("/:tourId/reviews", reviewRouter);

toursRouter.route("/get-tour-stats").get(tourControllers.getTourStats);

toursRouter
  .route("/top-5-tours")
  .get(tourControllers.aliasTopTours, tourControllers.getAllTours);

toursRouter
  .route("/get-monthly-plan/:year")
  .get(
    authControllers.protect,
    authControllers.restrictTo("admin", "lead-guide", "guide"),
    tourControllers.getMonthlyPlan
  );

toursRouter
  .route("/tours-within/:distance/center/:latlng/unit/:unit")
  .get(tourControllers.getToursWithin);

toursRouter
  .route("/distances/:latlng/unit/:unit")
  .get(tourControllers.getDistances);

toursRouter
  .route("/")
  .get(tourControllers.getAllTours)
  .post(
    authControllers.protect,
    authControllers.restrictTo("admin", "lead-guide"),
    authControllers.protect,
    tourControllers.createTour
  );
toursRouter
  .route("/:id")
  .get(tourControllers.getTour)
  .patch(
    authControllers.protect,
    authControllers.restrictTo("admin", "lead-guide"),
    tourControllers.uploadTourImages,
    tourControllers.resizeTourImages,
    tourControllers.updateTour
  )
  .delete(
    authControllers.protect,
    authControllers.restrictTo("admin", "lead-guide"),
    tourControllers.deleteTour
  );

module.exports = toursRouter;
