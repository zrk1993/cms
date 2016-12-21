/**
 * Created by renkun on 2016/12/12.
 */
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../proxy/user');

/**
 * 序列化与反序列化是passportjs保存用户登录状态的方式
 * 该值保存在session
 * 注：如果要想保存在session中的数据小一点，减小内存占用，可以只序列化user.id,用时在根据id得到user
 */
passport.serializeUser((user, done) => {
    done(null, user);//保存user到session中
});

//user：上一步保存在session中的值
passport.deserializeUser((user, done) => {
    done(null, user);//把user赋给`req.user`
});

/**
 * Sign in using Email and Password.
 */
passport.use(new LocalStrategy({ usernameField: 'username' }, (username, password, done) => {

    User.getUserByName(username, (err, user) => {
        if (err) { return done(err); }
        if (!user) {
            return done(null, false, { msg: `用户名 ${username} not found.` });
        }
        User.comparePassword(user,password, (err, isMatch) => {
            if (err) { return done(err); }
            if (isMatch) {
                return done(null, user);
            }
            return done(null, false, { msg: 'Invalid email or password.' });
        });
    });
}));


/**
 * 需要管理员权限
 */
exports.adminRequired = function (req, res, next) {
    if (!req.isAuthenticated()) {
        return res.render('notify/notify', { error: '你还没有登录。' });
    }

    if (!req.user.is_admin) {
        return res.render('notify/notify', { error: '需要管理员权限。' });
    }

    next();
};

/**
 * 需要登录
 */
exports.userRequired = function (req, res, next) {
    //passport扩展了HTTP request，添加了isAuthenticated()方法
    if (!req.isAuthenticated()) {
        return res.status(403).send('forbidden!');
    }
    next();
};
