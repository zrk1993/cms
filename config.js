/**
 * config
 */

const path = require('path');

const config = {
  // 程序运行的端口
    port: 8888,
    list_topic_count:25
};

if (process.env.NODE_ENV === 'test') {
  config.db = 'mongodb://127.0.0.1/test';
}


module.exports = config;
