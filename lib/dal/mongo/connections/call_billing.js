var logger = require('../../../../lib/logger'),
    MongoClient = require('mongodb').MongoClient,
    config = require('../../../../config/settings');

var connection;
module.exports = function (callback) {
    //if already we have a connection, don't connect to database again
    if (connection) {
        callback(connection);
        logger.info("reusing: " + config.mongo.database.call_billing.host +" connection");
        return;
    }

    MongoClient.connect(config.mongo.database.call_billing.host, function (err, db) {
        if (err) throw err;
        // store connection
        connection = db;
        logger.info("connected to: "+ config.mongo.database.call_billing.host);
        callback(connection);
    });
};