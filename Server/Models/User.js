const mongoose = require("mongoose");
const dotenv = require("dotenv");
const plm = require('passport-local-mongoose'); 
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const Schema = mongoose.Schema;
const userSchema = new Schema({
  username: String,
  password: String,
  refreshToken: String, // just adding this in case we use JWT
  roles: {
    type: Object,
    default: {
      User: 2001, // code 2001 is the default user role, we can add more roles here
    },
  },
  email: String,
  responses: [{ type: Schema.Types.ObjectId, ref: "Response" }], // to query responses per user easily (otherwise you have to query response collection)
  googleId: String,
  googleToken: String,
});

userSchema.plugin(plm);

const callbackURL = process.env.NODE_ENV === 'production' ? 
    'https://www.surveyspark.ca/auth/google/callback' :
    'http://localhost:3000/auth/google/callback';

// Creating a user from Google Oauth

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: callbackURL
},
(accessToken, refreshToken, profile, done) => {
  User.findOne({ googleId: profile.id }, (err, user) => {
    if (err) {
      return done(err);
    }
    if (!user) {
      user = new User({
        username: profile.displayName,
        email: profile.emails[0].value,
        googleId: profile.id,
        googleToken: accessToken // Store Google access token
      });
      user.save((err) => {
        if (err) console.error(err);
        return done(err, user);
      });
    } else {
      return done(err, user);
    }
  });
}
));

module.exports = mongoose.model("User", userSchema);