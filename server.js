const dotenv = require("dotenv");
const mongoose = require("mongoose");

process.on("uncaughtException", err => {
  console.log(err.name, err.message);
  console.log("Uncaught Exception Error, Shutting Down...");
  process.exit(1);
});

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("MongoDB Connection succeed");
  });

const app = require("./app");

const port = process.env.PORT || 5000;
const server = app.listen(port, () =>
  console.log(`listening on the port ${port}`)
);

process.on("unhandledRejection", err => {
  console.log(err.name, err.message);
  console.log("Unhandled Rejection Error, Shutting Down...");
  server.close(() => {
    process.exit(1);
  });
});
