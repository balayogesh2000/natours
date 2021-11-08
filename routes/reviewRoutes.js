const express = require("express");
const authControllers = require("../controllers/authController");
const reviewControllers = require("../controllers/reviewController");

const reviewRouter = express.Router({ mergeParams: true });

reviewRouter.use(authControllers.protect);

reviewRouter
  .route("/")
  .get(reviewControllers.getAllReviews)
  .post(
    authControllers.restrictTo("user"),
    reviewControllers.setTourUserIds,
    reviewControllers.createReview
  );

reviewRouter
  .route("/:id")
  .get(reviewControllers.getReview)
  .patch(
    authControllers.restrictTo("admin", "user"),
    reviewControllers.updateReview
  )
  .delete(
    authControllers.restrictTo("admin", "user"),
    reviewControllers.deleteReview
  );

module.exports = reviewRouter;
