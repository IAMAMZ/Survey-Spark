let User = require('../Models/user');
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
                res.redirect('/surveys');
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
    passport.authenticate('local', (err, user) => {
        console.log(err);
        if (err) {
            return res.redirect('/auth/login/invalid');
        }
        else {
            req.login(user, (err) => {
                if (user) {
                    return res.redirect('/surveys');
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

// make public
module.exports = {
    displayRegisterForm, displayLoginForm, submitRegister, submitLogin, logout
};