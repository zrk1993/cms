/**
 * Created by renkun on 2016/12/15.
 * 使用https://cnodejs.org，提供的api,
 * get /topics 主题首页
 接收 get 参数
 page Number 页数
 tab String 主题分类。目前有 ask share job good
 limit Number 每一页的主题数量
 mdrender String 当为 false 时，不渲染。默认为 true，渲染出现的所有 markdown 格式文本。
 示例：/api/v1/topics
 */

const models = require('../models');
const Topic = models.Topic;
const User = require('../proxy/user');

const request = require('request');
let page = 0;
let limit = 100;
const uri = `https://cnodejs.org/api/v1/topics?page=${page}&limit=${limit}&mdrender=false`;
request(uri, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        console.log(body); // Show the HTML for the Google homepage.

        let topics = JSON.parse(body);
        console.log(topics.data.length);
        console.log(uri);
        if (!!topics.success) {
            topics.data.forEach((topic) => {
                let topicModel = new Topic();
                topicModel.title = topic.title;
                topicModel.content = topic.content;
                topicModel.author_id = topic.author_id;
                topicModel.top = topic.top;
                topicModel.good = topic.good;
                topicModel.reply_count = topic.reply_count;
                topicModel.visit_count = topic.visit_count;
                topicModel.vote_count = topic.vote_count;
                topicModel.create_at = topic.create_at;
                topicModel.update_at = topic.update_at;
                topicModel.last_reply_at = topic.last_reply_at;
                topicModel.content_is_html = false;
                topicModel.tab = topic.tab;

                topicModel.save(function (err) {
                    if (err) {
                        console.log(err.toString())
                    }

                    crawlUser(topic.author.loginname);
                });
            });

        }
    }
});

/***
 * get /user/:loginname 用户详情

 示例：/api/v1/user/alsotang
 * @param userName
 */
function crawlUser(userName) {
    const uri = `https://cnodejs.org/api/v1/user/${userName}`;
    request(uri, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(userName); // Show the HTML for the Google homepage.

            let user = JSON.parse(body).data;
            if (!!user) {

                User.newAndSave(user.loginname,
                    user.loginname,
                    '123456',
                    '1051455824@qq.com',
                    user.avatar_url,
                    false,
                    function (err) {
                        if (err) {
                            console.log(err.toString())
                        }
                    });
            }
        }
    });
}
