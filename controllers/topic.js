/**
 * Created by renkun on 2016/12/13.
 */
const Topic = require('../proxy/topic');
const validator = require('validator');
const marked = require('marked');

/**
 * GET  /topic/get
 * 话题详情页
 */
exports.get=function (req,res) {

    Topic.getTopicById(req.params.id,(err,topic)=>{
        if(err)return res.status(404).end();

        parseTopic(topic, (err, t)=>{
            if(err){res.status(500).end('解析错误');}
            res.render('topic',{'topic' : t});
        });

    });


};

/**
 * 格式化一个topicmdel 为我们要的
 * @param topicModel
 * @param cb {err, topic}
 */
function parseTopic(topicModel, cb) {
    const topic = {};
    //解析markdown
    marked(topicModel.content, (err, parsedHtml)=>{

        topic.content = parsedHtml;
        topic.create_at='1個月前';
        topic.author = '小王';
        topic.visit_count='1000';
        topic.update_at='一天前';
        topic.tab = '精華';
        topic.title = topicModel.title || 'aa';
        topic.tab = topicModel.tab;

        cb(null, topic);

    })
}

/**
 * GET /topic/add
 * 话题编辑页
 */
exports.edit=function (req, res) {
  res.render('topicEdit',{user:req.user})
};

/**
 * POST /topic/add
 * 话题提交api
 */
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
        res.redirect('/topic/'+topic.id);
    });
};