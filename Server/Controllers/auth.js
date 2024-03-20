let User = require('../Models/User');
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require('passport');

let displayRegisterForm = (req, res, next) => {
    let messages = req.session.messages || [];
    req.session.messages = [];

    res.render('auth/register', { 
        title: 'Register',
        messages: messages,
        noHeaderFooter: true
    });
};

let submitRegister = (req, res, next) => {
    User.register(new User({ username: req.body.username }), req.body.password, (err, newUser) => {
        if (err) {
            return res.render('auth/register', { messages: err, noHeaderFooter: true });
        }
        else {
            req.login(newUser, (err) => {
                res.redirect('/survey');
            });
        }
    });
};

let displayLoginForm = (req, res, next) => {
    let messages = '';

    console.log(req.params);
    if (req.params.invalid) {
        messages = 'Invalid Login';
    }

    res.render('auth/login', { 
        title: 'Login', 
        messages: messages,
        noHeaderFooter: true
    });
};

let submitLogin = (req, res, next) => {
    passport.authenticate('local', (err, User) => {
        console.log(err);
        if (err) {
            return res.redirect('/auth/login/invalid');
        }
        else {
            req.login(User, (err) => {
                if (User) {
                    return res.redirect('/survey');
                }
                else {
                    return res.redirect('/auth/login/invalid');
                }             
            });
        }
    })(req, res, next);
};

let logout = (req, res, next) => {
    req.logout((err) => {
        return res.redirect('/');
    })
};

// Function to initiate Google OAuth authentication
let initiateGoogleAuthentication = (req, res, next) => {
    passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
};

const handleGoogleAuthentication = () => {
    const callbackURL = process.env.NODE_ENV === 'production' ? 
        'https://www.surveyspark.ca/auth/google/callback' :
        'http://localhost:3000/auth/google/callback';

    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: callbackURL
    },
    (accessToken, refreshToken, profile, done) => {
        User.findOne({ googleId: profile.id }, (err, user) => {
            if (err) {
                console.error("Error finding user:", err); // Log the error
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
                    if (err) {
                        console.error("Error saving user:", err); // Log the error
                        return done(err);
                    }
                    return done(null, user);
                });
            } else {
                return done(null, user);
            }
        });
    }));
};

// make public
module.exports = {
    displayRegisterForm, displayLoginForm, submitRegister, submitLogin, logout, initiateGoogleAuthentication, handleGoogleAuthentication
};