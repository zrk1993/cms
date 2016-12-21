const models  = require('../models');
const uuid    = require('node-uuid');
const User    = models.User;


/**
 * 根据用户名查找用户
 * Callback:
 * - err, 数据库异常
 * - user, 用户
 * @param {String} name 登录名
 * @param {Function} callback 回调函数
 */
exports.getUserByName = function (name, callback) {
  User.findOne({'name': String(name).trim().toLocaleLowerCase()}, callback);
};

/**
 * 根据id查找用户
 * Callback:
 * - err, 数据库异常
 * - user, 用户
 * @param {String} id
 * @param {Function} callback 回调函数
 */
exports.getUserById = function (id, callback) {
    User.findById(id , callback);
};


/**
 * 判断密码是否匹配。
 * 因为数据库的密码加密了，判断密码相等要解密。
 * Callback:
 * - err, 数据库异常
 * - isMatch, 是否匹配
 * @param {String} password 登录名
 * @param {Function} callback 回调函数
 */
exports.comparePassword = function (user, password, callback) {
    callback(null, user.pass == password);
};

exports.newAndSave = function (name, pass, email, callback) {
  let user         = new User();
  user.name        = name;
  user.pass        = pass;
  user.email       = email;

  user.id = uuid.v4();

  user.save(callback);
};

