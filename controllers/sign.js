const passport = require('passport');

const User = require('../proxy/user');

exports.showSignIn = function (req, res) {
    res.render('sign.html');
};

exports.showSignUp = function (req, res) {
    res.render('sign.html');
};

/**
 * POST /signIn
 * 登陆
 */
exports.signIn = function (req, res,next) {
    passport.authenticate('local', (err, user, info) => {
        if (err) { return next(err); }
        if (!user) {
            return res.end(JSON.stringify(info));
        }
        req.logIn(user, (err) => {
            if (err) { return next(err); }
            res.end('success');
        });
    })(req, res, next);
};

/**
 * POST /signUp
 * 注册
 */
exports.signUp = function (req, res) {
    const username = req.body.username;
    const  password = req.body.password;
    const email = req.body.email;

    User.newAndSave(username,password,email,(err,user)=>{
        if(err){
            res.end(err.toString());
        }
        else {
            res.end(user.toString());
        }
    });
};
