const AppError = require("../utils/appError");

const handleCastErrorDB = err => {
  return new AppError(`Invalid ${err.path} : ${err.value}`, 400);
};

const handleDuplicateFieldsDB = err => {
  const { name } = err.keyValue;
  const message = `Duplicate field value : ${name}, Please use another value`;
  return new AppError(message, 400);
};

const handleValidationError = err => {
  const errors = Object.values(err.errors).map(el => el.message);
  return new AppError(`Invalid input data, ${errors.join(". ")}`, 400);
};

const handleJWTError = () => {
  return new AppError("Invalid Token. Please login again!", 401);
};

const handleTokenExpiredError = () => {
  return new AppError("Your token has Expired. Please login again!", 401);
};

const sendErrorDev = (err, req, res) => {
  // A) API
  if (req.originalUrl.startsWith("/api")) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      err: err,
      stack: err.stack
    });
  }

  // B) RENDERED WEBSITE
  console.log("Error : ", err);
  return res.status(err.statusCode).render("error", {
    title: "Something went wrong!",
    msg: err.message
  });
};

const sendErrorProd = (err, req, res) => {
  // A) API
  if (req.originalUrl.startsWith("/api")) {
    // Operational, trusted error: send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    }
    // Programming or unknown errors: don't leak error details

    // 1) Log error
    console.log("Error : ", err);

    // 2) Send generic message
    return res.status(500).json({
      status: "error",
      message: "Something went wrong"
    });
  }
  // B) RENDERED WEBSITE
  if (err.isOperational) {
    res.status(err.statusCode).render("error", {
      title: "Something went wrong!",
      msg: err.message
    });
  } else {
    // Programming or unknown errors: don't leak error details

    // 1) Log error
    console.log("Error : ", err);

    // 2) Send generic message
    res.status(err.statusCode).render("error", {
      title: "Something went wrong!",
      msg: "Please try again later."
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err, message: err.message };
    if (err.name === "CastError") error = handleCastErrorDB(error);
    if (err.code === 11000) error = handleDuplicateFieldsDB(error);
    if (err.name === "ValidationError") error = handleValidationError(error);
    if (err.name === "JsonWebTokenError") error = handleJWTError();
    if (err.name === "TokenExpiredError") error = handleTokenExpiredError();
    sendErrorProd(error, req, res);
  }
};
