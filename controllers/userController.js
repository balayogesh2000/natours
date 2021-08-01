const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const filterObj = (obj, ...keys) => {
  const filteredObj = {};
  Object.keys(obj).forEach(el => {
    if (keys.includes(el)) filteredObj[el] = obj[el];
  });
  return filteredObj;
};

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: "success",
    results: users.length,
    users
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create Error if user posts password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password updates. Please use /updateMyPassword.",
        400
      )
    );
  }

  // 2) Update user document
  const filteredBody = filterObj(req.body, "name", "email");
  const updatedUser = await User.findByIdAndUpdate(req.user._id, filteredBody, {
    new: true,
    runValidators: true
  });
  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser
    }
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });

  res.status(204).json({
    status: "success",
    data: null
  });
});

exports.getUser = (req, res) => {
  res.status(500).json({
    status: "success",
    message: "Routes not yet created for this endpoint"
  });
};
exports.createUser = async (req, res) => {
  const newUser = await User.create(req.body);
  res.status(500).json({
    status: "success",
    user: newUser
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: "success",
    message: "Routes not yet created for this endpoint"
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: "success",
    message: "Routes not yet created for this endpoint"
  });
};
