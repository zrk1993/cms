/**
 * config
 */

const path = require('path');

const config = {
  // 程序运行的端口
  port: 3333,
};

if (process.env.NODE_ENV === 'test') {
  config.db = 'mongodb://127.0.0.1/node_club_test';
}

module.exports = config;
