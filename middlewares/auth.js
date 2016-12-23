/**
 * Created by renkun on 2016/12/12.
 */
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github').Strategy;

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
 * local
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
 * Sign in with GitHub.
 */
passport.use(new GitHubStrategy({
    clientID: '1ba17f7eb35dd18b41a6',
    clientSecret: 'a4e4bee94a0a3be271e09e3b5864eb56fe406c34',
    callbackURL: 'http://127.0.0.1:8888/auth/github/callback',
    passReqToCallback: true
}, (req, accessToken, refreshToken, profile, done) => {
    if (req.user) {
        //用户已经登录，已有账号，现在要绑定github账号
        User.getUsersByQuery({ 'github.id': profile.id }, (err, existingUser) => {
            if (existingUser && existingUser.length) {
                //改github账户已经绑定过了。注：一个github账户只能绑定一个账户
                done(err);
            } else {
                //更新github信息
                User.githubUpdate(req.user.id,profile,(err,user) => {
                    done(err, user);
                });
            }
        });
    } else {
        //用户还未登录
        User.getUsersByQuery({ 'github.id': profile.id }, (err, existingUser) => {
            existingUser = existingUser[0];//query查询出来的是数组
            if (err) { return done(err); }
            if (existingUser) {
                //该github账号有绑定的账户了，直接用改账号登录
                existingUser.auth='github';
                return done(null, existingUser);
            }
            //该github账号还没有对应的本地账户。要创建账户
            User.getUsersByQuery({ email: profile._json.email }, (err, existingEmailUser) => {
                if (err) { return done(err); }
                if (existingEmailUser.length) {
                    //改邮箱是否被使用了
                    done(err);
                } else {
                    //创建用户
                    User.githubNewAndSave(profile,(err,user) => {
                        user.auth='github';
                        done(err, user);
                    });
                }
            });
        });
    }
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

exports.authGitHub = function (req, res, next) {
    passport.authenticate('github')(req, res, next);
};

exports.authGitHubCallBack = function (req, res, next) {
    passport.authenticate('github', { failureRedirect: '/login' })(req, res, next);
};