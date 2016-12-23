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
 * 根据关键字，获取一组用户
 * Callback:
 * - err, 数据库异常
 * - users, 用户列表
 * @param {String} query 关键字
 * @param {Object} opt 选项
 * @param {Function} callback 回调函数
 */
exports.getUsersByQuery = function (query, opt, callback) {
    User.find(query, '', opt, callback);
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

/**
 * github初次登录时
 * @param profile
 * @param callback
 */
exports.githubNewAndSave = function (profile, callback) {
    const user         = new User();

    user.name        = profile.username || profile._json.name;
    user.pass        = profile.id || profile._json.id;
    user.email       = profile.emails[0].value || profile._json.email;
    user.picture = profile.photos[0].value || profile._json.avatar_url;

    user.github.id = profile.id || profile._json.id;
    user.github.name = profile.displayName || profile._json.name;
    user.github.picture = profile.photos[0].value || profile._json.avatar_url;
    user.github.url = profile._json.url;
    user.github.bio = profile._json.bio;

    user.id = uuid.v4();
    user.save(callback);

    console.log('save')
};

/**
 * github再次登录
 * @param id{req.user.id}
 * @param profile
 * @param callback
 */
exports.githubUpdate = function (id,profile, callback) {
    User.findById(id, (err, user) => {
        if (err) { return done(err); }
        user.github.id = profile.id || profile._json.id;
        user.github.name = profile.displayName || profile._json.name;
        user.github.picture = profile.photos[0].value || profile._json.avatar_url;
        user.github.url = profile._json.url;
        user.github.bio = profile._json.bio;
        user.save(callback);
    });

    console.log('update')
};



/*
*
{ id: '12870303',
 displayName: '仁焜',
 username: 'my-soul',
 profileUrl: 'https://github.com/my-soul',
 emails: [ { value: '1051455824@qq.com' } ],
 photos: [ { value: 'https://avatars.githubusercontent.com/u/12870303?v=3' } ],
 provider: 'github',
_json:
 { login: 'my-soul',
 id: 12870303,
 avatar_url: 'https://avatars.githubusercontent.com/u/12870303?v=3',
 url: 'https://api.github.com/users/my-soul',
 html_url: 'https://github.com/my-soul',
 type: 'User',
 site_admin: false,
 name: '仁焜',
 company: '联合国',
 blog: 'movielife.top',
 location: '月亮',
 email: '1051455824@qq.com',
 bio: '小世界 大梦想',
} }
* */

