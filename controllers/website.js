/**
 * Created by renkun on 2016/12/9.
 */

const config =require('../config');
const Topic = require('../proxy/topic');

exports.index = function (req, res) {
    let page = parseInt(req.query.page, 10) || 1;
    page = page > 0 ? page : 1;
    const tab = req.query.tab || 'all';
    const query = {};
    const limit = config.list_topic_count;
    const options = { skip: (page - 1) * limit, limit: limit, sort: '-top -last_reply_at'};

    Topic.getTopicsByQuery(query, options, function (err, topics) {
        res.render('index.html',{topics:topics,tab:tab,page_count:20,current_page:page});
    });

};

exports.tag = function (req, res) {
    res.render('tag.html');
};