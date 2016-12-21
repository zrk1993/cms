/**
 * Created by renkun on 2016/12/12.
 */
const models     = require('../models');

/**
 * 需要管理员权限
 */
exports.adminRequired = function (req, res, next) {
    if (!req.user) {
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
    if (!req.user||!req.user.name) {
        return res.status(403).send('forbidden!');
    }
    next();
};
