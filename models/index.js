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
});
mongoose.Promise = Promise;

// models
require('./topic');

exports.Topic        = mongoose.model('Topic');
