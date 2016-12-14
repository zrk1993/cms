/**
 * Created by renkun on 2016/12/13.
 */
const topic = require('../proxy/topic');


exports.get=function (req,res) {
    res.end('q');
};

exports.newAndSave = function(req,res){
    topic.newAndSave('1','2','3','4',function (err) {
        if(err)res.end(err.toString());
        else {
            res.end('save ok')
        }
    })
};