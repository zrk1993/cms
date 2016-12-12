/**
 * 网站路由
 */

const express = require('express');
const sign = require('./controllers/sign');
const website = require('./controllers/website');

const router = express.Router();

router.get('/', website.index);  // 进入登录页面

router.get('/tag', website.tag);  // 进入登录页面

router.get('/signin', sign.showLogin);  // 进入登录页面


module.exports = router;
