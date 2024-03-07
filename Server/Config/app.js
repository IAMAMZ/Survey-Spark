// required node modules
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const dotenv = require("dotenv");
const Survey = require("../Models/Survey.js");
const Response = require("../Models/Response.js");
const mongoose = require("mongoose");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const hbs = require("hbs");

const dbConfig = require("../Config/db.js");

// connect to the database
mongoose
  .connect(dbConfig.DB_URI)
  .then(() => {
    console.log("Connected to MongoDb");
  })
  .catch((err) => console.err("Could not connect to MongoDb", err));

// Routing modules
const indexRouter = require("../Routes/index.js");
const surveyRouter = require("../Routes/survey.js");
const questionRouter = require("../Routes/question.js");
const sectionRouter = require("../Routes/section.js");
const takeSurveyRouter = require("../Routes/takeSurvey.js");
const app = express();

// link to .env file if not in production mode
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// db connection - must be after express app instantiated
mongoose
  .connect(process.env.MONGO_DB_URI, {})
  .then((res) => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(`Connection failure: ${err}`);
  });

// view engine setup
app.set("views", path.join(__dirname, "../Views"));
app.set("view engine", "hbs");

// register hbs helpers
// hbs.registerPartials(path.join(__dirname, "../Views/components/"));
// hbs.registerPartials(path.join(__dirname, "../Views/content/"));

// hbs.registerHelper("loadPage", function (pageName) {
//   console.log("pageName: " + pageName);
//   return pageName;
// });

// middleware configuration
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "../../Client")));
app.use(express.static(path.join(__dirname, "../../node_modules")));

app.use("/survey", sectionRouter);
app.use("/survey", surveyRouter);
app.use("/survey", questionRouter);
app.use("/takeSurvey", takeSurveyRouter);

app.use("/", indexRouter);
hbs.registerHelper("selectOption", (currentValue, selectedValue) => {
  let selectedProperty = "";

  if (currentValue === selectedValue) {
    selectedProperty = " selected";
  }

  return new hbs.SafeString(
    `<option${selectedProperty}>${currentValue}</option>`
  );
});

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
  res.render("error", { title: `Error: ${err.status}`, page: "error" });
});

module.exports = app;
