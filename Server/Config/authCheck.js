const passport = require('passport');
const User = require('../Models/User');

/* this middleware checks if the user is authenticated. if not it will redirect and prevent further execution*/
let isAuthenticated = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/auth/login');
    }
    return next();
};

module.exports = isAuthenticated;