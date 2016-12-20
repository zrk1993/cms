/**
 * Created by renkun on 2016/12/12.
 */
const mongoose = require('mongoose');
const config   = require('../config');
const logger = require('../services/logger');

mongoose.connect('mongodb://localhost/test', {
    server: {poolSize: 20}
}, function (err) {
    if (err) {
        logger.error('connect to %s error: ', config.db, err.message);
        process.exit(1);
    }
    logger.info('connect to %s : ', config.db);
});
mongoose.Promise = Promise;

// models
require('./topic');
require('./User');

exports.Topic        = mongoose.model('Topic');
exports.User        = mongoose.model('User');
