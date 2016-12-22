const passport = require('passport');

const User = require('../proxy/user');

exports.showSignIn = function (req, res) {
    req.session._loginReferer = req.originalUrl;
    res.render('sign.html',{user:req.user});
    console.dir(req.user)
};

exports.showSignUp = function (req, res) {
    res.render('sign.html',{user:req.user});
    console.dir(req.user)
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
            res.redirect(req.session._loginReferer);
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

/**
 * 退出登录
 */
exports.logOut = function (req, res) {
    //logOut()：别名为logout()作用是登出用户，删除该用户session。不带参数,由passport扩展了HTTP request。
    req.logOut();
    res.redirect('/');
};
