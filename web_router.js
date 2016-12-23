/**
 * 网站路由
 */

const express = require('express');
const sign = require('./controllers/sign');
const website = require('./controllers/website');
const topic = require('./controllers/topic');
const auth = require('./middlewares/auth');

const router = express.Router();


router.get('/',  website.index);

//local 登陆
router.get('/signIn', sign.showSignIn);
router.get('/signUp', sign.showSignUp);
router.post('/signIn', sign.signIn);
router.post('/signUp', sign.signUp);
router.get('/logOut', sign.logOut);

//auth 登陆
router.get('/auth/github',auth.authGitHub);
router.get('/auth/github/callback', auth.authGitHubCallBack,function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
});



router.get('/topic', topic.get);
router.post('/topic/add',auth.userRequired, topic.add);
router.get('/topic/add',auth.userRequired, topic.add);


module.exports = router;
