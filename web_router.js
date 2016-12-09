/**
 * 网站路由
 */

const express = require('express');
const sign = require('./controllers/sign');

const router = express.Router();

router.get('/signin', sign.showLogin);  // 进入登录页面


module.exports = router;
