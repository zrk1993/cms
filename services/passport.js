/**
 * Created by renkun on 2016/12/21.
 */
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../proxy/user');

//user.id序列化到session中，即sessionID，同时它将作为凭证存储在用户cookie中
passport.serializeUser((user, done) => {
    done(null, user.id);
});

//从session反序列化，参数为用户提交的sessionID，若存在则从数据库中查询user并存储与req.user中
passport.deserializeUser((id, done) => {
    User.getUserById(id, (err, user) => {
        done(err, user);
    });
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