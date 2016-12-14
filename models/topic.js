/**
 * Created by renkun on 2016/12/12.
 */
const mongoose  = require('mongoose');
const BaseModel = require("./base_model");
const Schema    = mongoose.Schema;
const ObjectId  = Schema.ObjectId;
const config    = require('../config');

const TopicSchema = new Schema({
    title: { type: String },
    content: { type: String },
    author_id: { type: String },
    top: { type: Boolean, default: false },         // 置顶帖
    good: {type: Boolean, default: false},          // 精华帖
    lock: {type: Boolean, default: false},          // 被锁定主题
    reply_count: { type: Number, default: 0 },      //浏览数
    visit_count: { type: Number, default: 0 },      //回复数
    vote_count: { type: Number, default: 0 },       //点赞数
    create_at: { type: Date, default: Date.now },   //创建时间
    update_at: { type: Date, default: Date.now },   //最后更新时间
    last_reply: { type: ObjectId },                   //最后回复人的id
    last_reply_at: { type: Date, default: Date.now },
    content_is_html: { type: Boolean },               //内容类型
    tab: {type: String},
    deleted: {type: Boolean, default: false},          //是否已经删除
});

TopicSchema.plugin(BaseModel);
TopicSchema.index({create_at: -1});
TopicSchema.index({top: -1, last_reply_at: -1});
TopicSchema.index({author_id: 1, create_at: -1});


mongoose.model('Topic', TopicSchema);

