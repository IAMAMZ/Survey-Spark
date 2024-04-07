let User = require('../Models/User');
const passport = require('passport');
const crypto = require('crypto');
const sgMail = require("@sendgrid/mail");

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
    User.register(new User({ username: req.body.username,email:req.body.username }), req.body.password, (err, newUser) => {
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

const displayForgotPasswordForm = async (req,res)=>{

    res.render('auth/forgotPassword', { 
        title: 'Password reset', 
    });

}
const handleForgotPassword = async (req,res)=>{
    const { email } = req.body;

    console.log(email);
    const user = await User.findOne({ email: email });
    if (!user) {
        res.render('auth/forgotPassword', { 
            title: 'Password reset', 
            message:'This account does not exist'
        });
        return;
    }
  
    const token = crypto.randomBytes(20).toString('hex');
  
    console.log(token);
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour expiary
  
    await user.save();
  
    const resetURL = `http://${req.headers.host}/auth/reset-password/${token}`;
  
    const msg = {
      to: email,
      from: 'solvesparktechnologies@gmail.com',
      subject: 'Password Reset',
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
             Please click on the following link, or paste this into your browser to complete the process:\n\n
             ${resetURL}\n\n
             If you did not request this, please ignore this email and your password will remain unchanged.\n`
    };
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  
    sgMail.send(msg).then(() => {
      console.log('Email sent');
      res.render('auth/passresetmsg', { 
        title: 'Password reset', 
    });
      
    }).catch((error) => {
      console.error(error);
      res.render('auth/forgotPassword', { 
        title: 'Password reset', 
        messege:"something went wrong"
    });
    });
}

const displayPasswordResetForm = async (req,res)=>{
    const token = req.params.token;
    const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
        console.log('Password reset token is invalid or expired');
        return res.redirect('/auth/login');
    }

    res.render('auth/resetPassword', { 
        title: 'Reset Password', 
        token: token
    });

}
const processPasswordLink = async (req, res) => {
        const token = req.params.token;
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });
    
        if (!user) {
            console.log('Password reset token is invalid or has expired');
            return res.redirect('/auth/login');
        }
    
        // set their password if all is valid
        user.setPassword(req.body.password, async (err) => {
            if (err) {
                console.log('Error setting new password', err);
                return res.redirect('/auth/login');
            }
            
            // remove the tokens
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
    
            await user.save();
    
            // Automatically log the user in and redirect them to suvey
            req.login(user, (err) => {
                if (err) {
                    console.log('Error logging in after password reset', err);
                    return res.redirect('/auth/login');
                }
                return res.redirect('/survey'); 
            });
        });

}

// make public
module.exports = {
    displayRegisterForm, displayLoginForm, submitRegister, submitLogin, logout,
     initiateGoogleAuthentication, handleGoogleAuthenticationCallback,
     displayForgotPasswordForm,
     handleForgotPassword,
     displayPasswordResetForm,
     processPasswordLink
};