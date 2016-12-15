/**
 * 网站路由
 */

const express = require('express');
const sign = require('./controllers/sign');
const website = require('./controllers/website');
const topic = require('./controllers/topic');

const router = express.Router();

router.get('/', website.index);  // 进入登录页面

router.get('/tag', website.tag);  // 进入登录页面

router.get('/signin', sign.showLogin);  // 进入登录页面

router.get('/topic', topic.get);  // 进入登录页面

router.post('/topic/add', topic.add);  //add topic

module.exports = router;
