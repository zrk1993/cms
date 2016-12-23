/**
 * Created by renkun on 2016/12/13.
 */
const Topic = require('../proxy/topic');
const validator = require('validator');


exports.get=function (req,res) {
    res.end('q');
};

exports.edit=function (req, res) {
  res.render('topicEdit',{user:req.user})
};

exports.add = function (req, res, next) {
    const title   = req.body.title;
    const tab     = req.body.tab;
    const content = req.body.content;
    const authorId = req.user._id;

    // 验证
    let editError;
    if (title === '') {
        editError = '标题不能是空的。';
    } else if (title.length < 5 || title.length > 100) {
        editError = '标题字数太多或太少。';
    }
     else if (content === '') {
        editError = '内容不可为空';
    }
    // END 验证

    if (editError) {
        res.status(422);
        return res.end(editError);
    }

    Topic.newAndSave(title, content, tab, authorId, function (err, topic) {
        if (err) {
            return next(err);
        }
        res.end('add ok')
    });
};