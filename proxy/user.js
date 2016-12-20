const models  = require('../models');
const uuid    = require('node-uuid');
const User    = models.User;


/**
 * 根据登录名查找用户
 * Callback:
 * - err, 数据库异常
 * - user, 用户
 * @param {String} loginName 登录名
 * @param {Function} callback 回调函数
 */
exports.getUserByLoginName = function (loginName, callback) {
  User.findOne({'loginname': new RegExp('^'+loginName+'$', "i")}, callback);
};

exports.newAndSave = function (name, loginname, pass, email, avatar_url, active, callback) {
  let user         = new User();
  user.name        = loginname;
  user.loginname   = loginname;
  user.pass        = pass;
  user.email       = email;
  user.avatar      = avatar_url;
  user.active      = active || false;
  user.accessToken = uuid.v4();

  user.save(callback);
};

