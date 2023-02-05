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

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
// declare idx
const idx = 0;
app.set("idx", idx);
// declare queueMap
const queueMap = new Map();
app.set("queueMap", queueMap);
// declare eventEmitter
const events = require("events");
const eventEmitter = new events.EventEmitter();
app.set("eventEmitter", eventEmitter);

const businessRouter = require("./routes/business");

app.use("/business", businessRouter);

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
