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



const request = require('request');
let page = 0;
let limit = 100;
const uri = `https://cnodejs.org/api/v1/topics?page=${page}&limit=${limit}&mdrender=false`;
request(uri, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        console.log(body); // Show the HTML for the Google homepage.
    }
    let topics = JSON.parse(body);
    console.log(topics.data.length);
    console.log(uri);
    if(!!topics.success){
        topics.data.forEach((topic)=>{
            request.post({
                    url: 'http://localhost:8888/topic/add',
                    form: {title: topic.title,tab:topic.tab,t_content:topic.content,authorId:topic.author.avatar_url}
                },
                function (err, httpResponse, body) {
                    /* ... */
                    if(err){
                        return console.log(err.toString());
                    }
                    console.log(body)
                }
            )
        });

    }
});