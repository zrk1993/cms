/**
 * Created by renkun on 2016/12/13.
 */
const Topic = require('../proxy/topic');
const validator = require('validator');


exports.get=function (req,res) {
    res.end('q');
};

exports.add = function (req, res, next) {
    const title   = validator.trim(req.body.title);
    const tab     = validator.trim(req.body.tab);
    const content = validator.trim(req.body.t_content);
    const authorId = validator.trim(req.body.authorId);

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