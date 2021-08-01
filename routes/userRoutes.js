const express = require("express");
const userControllers = require("../controllers/userController");
const authControllers = require("../controllers/authController");

const usersRouter = express.Router();

usersRouter.route("/signup").post(authControllers.signup);
usersRouter.route("/login").post(authControllers.login);

usersRouter.route("/forgotPassword").post(authControllers.forgotPassword);
usersRouter.route("/resetPassword/:token").patch(authControllers.resetPassword);
usersRouter
  .route("/updateMyPassword")
  .patch(authControllers.protect, authControllers.updatePassword);
usersRouter
  .route("/updateMe")
  .patch(authControllers.protect, userControllers.updateMe);
usersRouter
  .route("/deleteMe")
  .delete(authControllers.protect, userControllers.deleteMe);

usersRouter
  .route("/")
  .get(authControllers.protect, userControllers.getAllUsers)
  .post(authControllers.protect, userControllers.createUser);
usersRouter
  .route("/:id")
  .get(authControllers.protect, userControllers.getUser)
  .patch(authControllers.protect, userControllers.updateUser)
  .delete(authControllers.protect, userControllers.deleteUser);

module.exports = usersRouter;
