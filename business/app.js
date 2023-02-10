var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var app = express();

// declare body parser middleware to parse json body
const bp = require("body-parser");
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(
  logger("dev", {
    // skip: () =>
    //   function (req, res) {
    //     return res.statusCode == 200;
    //   },
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// redis client
// const Redis = require("ioredis");
// const redis = new Redis({
//   host: process.env.REDIS_HOST || "localhost",
//   port: process.env.REDIS_PORT || 6379,
// });

// app.use(async (req, res, next) => {
//   req.redisClient = redis;
//   next();
// });

const businessRouter = require("./routes/business");

// app.get("/", (req, res) => {
//   console.log("hello");
//   res.send("hello");
// });

// let counter = 0;
// app.use((req, res, next) => {
//   counter++;
//   console.log(counter);
//   next();
// });

app.use("/", businessRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
