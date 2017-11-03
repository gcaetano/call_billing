/**
 * log4js base configuration
 * using:
 * var logger = require('../../../lib/logger')
 * logger.info("message")
 * logger.error("message")
 * logger.warn("message")
 * logger.debug("message")
 * A daily routing will used to organize them. The log files can be find into ./logs/ directory
 */


var log4js = require("log4js"),
    config = require('../../lib/config/settings');

// Path to where log4js configuration file is.
log4js.configure(config.log4js.file, {});

// load appender (appender can be console, datafiles...), this system uses just dateFile
log4js.loadAppender(config.log4js.appender);

var logger = log4js.getLogger(config.log4js.route.default);

module.exports = logger;