/**
 * 网站路由
 */

const express = require('express');
const sign = require('./controllers/sign');
const site = require('./controllers/site');

const router = express.Router();

router.get('/', site.index);  // 进入登录页面

router.get('/signin', sign.showLogin);  // 进入登录页面


module.exports = router;
