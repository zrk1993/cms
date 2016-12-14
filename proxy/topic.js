/**
 * Created by renkun on 2016/12/12.
 */
const models     = require('../models');
const Topic      = models.Topic;


exports.newAndSave = function (title, content, tab, authorId, callback) {
    const topic       = new Topic();
    topic.title     = title;
    topic.content   = content;
    topic.tab       = tab;
    topic.author_id = authorId;

    topic.save(callback);
};