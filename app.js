const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const path = require("path");
const cookieParser = require("cookie-parser");
const csp = require("express-csp");
const compression = require("compression");

const toursRouter = require("./routes/tourRoutes");
const usersRouter = require("./routes/userRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const bookingRouter = require("./routes/bookingRoutes");
const viewRouter = require("./routes/viewRoutes");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

const app = express();

app.enable("trust proxy");

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// console.log(process.env.NODE_ENV);
// 1) Global Middlewares

// set Security HTTP headers
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'", "https:", "http:", "data:", "ws:"],
      baseUri: ["'self'"],
      fontSrc: ["'self'", "https:", "http:", "data:"],
      scriptSrc: ["'self'", "https:", "http:", "blob:"],
      styleSrc: ["'self'", "'unsafe-inline'", "https:", "http:"]
    }
  })
);

csp.extend(app, {
  policy: {
    directives: {
      "default-src": ["self"],
      "style-src": ["self", "unsafe-inline", "https:"],
      "font-src": ["self", "https://fonts.gstatic.com"],
      "script-src": [
        "self",
        "unsafe-inline",
        "data",
        "blob",
        "https://js.stripe.com",
        "https://*.mapbox.com",
        "https://*.cloudflare.com/",
        "https://bundle.js:8828",
        "ws://localhost:56558/"
      ],
      "worker-src": [
        "self",
        "unsafe-inline",
        "data:",
        "blob:",
        "https://*.stripe.com",
        "https://*.mapbox.com",
        "https://*.cloudflare.com/",
        "https://bundle.js:*",
        "ws://localhost:*/"
      ],
      "frame-src": [
        "self",
        "unsafe-inline",
        "data:",
        "blob:",
        "https://*.stripe.com",
        "https://*.mapbox.com",
        "https://*.cloudflare.com/",
        "https://bundle.js:*",
        "ws://localhost:*/"
      ],
      "img-src": [
        "self",
        "unsafe-inline",
        "data:",
        "blob:",
        "https://*.stripe.com",
        "https://*.mapbox.com",
        "https://*.cloudflare.com/",
        "https://bundle.js:*",
        "ws://localhost:*/"
      ],
      "connect-src": [
        "self",
        "unsafe-inline",
        "data:",
        "blob:",
        "wss://<HEROKU-SUBDOMAIN>.herokuapp.com:<PORT>/",
        "https://*.stripe.com",
        "https://*.mapbox.com",
        "https://*.cloudflare.com/",
        "https://bundle.js:*",
        "ws://localhost:*/"
      ]
    }
  }
});

// Limit requests from same  API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP. Please try again in an hour"
});

app.use("/api", limiter);

// Body parser, reading data from the body into req.body
app.use(
  express.json({
    limit: "10kb"
  })
);
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

// Data sanitization against NOSQL query injection
app.use(mongoSanitize());

// Data sanitization against xss
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsQuantity",
      "ratingsAverage",
      "maxGroupSize",
      "difficulty",
      "price"
    ]
  })
);

// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Serving static files
app.use(express.static(path.join(__dirname, "public")));

app.use(compression());

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers)
  // console.log(req.cookies);
  next();
});

// 3) Routes
app.use("/api/v1/tours", toursRouter);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/bookings", bookingRouter);
app.use("/", viewRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
