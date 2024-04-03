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
const passport = require('passport');
const session = require('express-session');
const createMemoryStore = require('memorystore');

// to prevent memory leaks
const MemoryStore = createMemoryStore(session);

// if not in production get dotenv 
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
const authRouter = require('../Routes/auth');
const indexRouter = require("../Routes/index.js");
const surveyRouter = require("../Routes/survey.js");
const questionRouter = require("../Routes/question.js");
const sectionRouter = require("../Routes/section.js");
const takeSurveyRouter = require("../Routes/takeSurvey.js");
const responseRouter = require("../Routes/response.js");
const app = express();




// view engine setup
app.set("views", path.join(__dirname, "../Views"));
app.set("view engine", "hbs");

// this helper to compare the options
hbs.registerHelper("ifCond", function (v1, operator, v2, options) {
  switch (operator) {
    case "===":
    case "eq":
      return v1 === v2 ? options.fn(this) : options.inverse(this);
    case "!==":
      return v1 !== v2 ? options.fn(this) : options.inverse(this);
    default:
      return options.inverse(this);
  }
});

// this helper to increment value 
hbs.registerHelper('inc', function(value, options) {
  return parseInt(value) + 1;
});

// middleware configuration
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "../../Client")));
app.use(express.static(path.join(__dirname, "../../node_modules")));

app.use(session({
  secret: process.env.PASSPORT_SECRET,
  resave: true,
  saveUninitialized: false,
  store: new MemoryStore({ checkPeriod: 86400000 })
}));

app.use(passport.initialize());
app.use(passport.session());

const User = require('../Models/User.js');
const GoogleStrategy = require("passport-google-oauth20").Strategy;
passport.use(User.createStrategy());

// Not very helpful source: https://www.passportjs.org/packages/passport-google-oauth2/

const callbackURL = process.env.NODE_ENV === 'production' ? 
    'https://www.surveyspark.ca/auth/google/callback' :
    'http://localhost:3000/auth/google/callback';

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: callbackURL
},
(accessToken, refreshToken, profile, done) => {
  User.findOne({ googleId: profile.id }) // Remove the callback
    .then(user => {
      if (!user) {
        user = new User({
          username: profile.displayName,
          email: profile.emails[0].value,
          googleId: profile.id,
          googleToken: accessToken // Store Google access token
        });
        return user.save();
      } else {
        return user;
      }
    })
    .then(user => {
      done(null, user);
    })
    .catch(err => {
      console.error("Error finding or creating user:", err);
      done(err);
    });
}
));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/**************** Routes **************************/

app.use("/survey", sectionRouter);
app.use("/survey", surveyRouter);
app.use("/survey", questionRouter);
app.use('/auth', authRouter);
app.use("/takeSurvey", takeSurveyRouter);
app.use("/responses",responseRouter);

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
