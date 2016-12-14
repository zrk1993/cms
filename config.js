/**
 * config
 */

const path = require('path');

const config = {
  // 程序运行的端口
  port: 8888,
};

if (process.env.NODE_ENV === 'test') {
  config.db = 'mongodb://127.0.0.1/test';
}

module.exports = config;
