let User = require('../Models/User');
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

let handleGoogleAuthenticationCallback = (req, res, next) => {
    passport.authenticate('google', (err, user) => {
        if (err) {
            console.error("Google OAuth Error:", err);
            return res.redirect('/');
        }
        if (!user) {
            console.error("Google OAuth Error: User not found");
            return res.redirect('/');
        }

        // Output user information to the console
        console.log("Google OAuth User:", user);

        req.login(user, (err) => {
            if (err) {
                console.error("Google OAuth Error:", err);
                return res.redirect('/');
            }
            res.redirect('/survey');
        });
    })(req, res, next);
};

// make public
module.exports = {
    displayRegisterForm, displayLoginForm, submitRegister, submitLogin, logout, initiateGoogleAuthentication, handleGoogleAuthenticationCallback
};