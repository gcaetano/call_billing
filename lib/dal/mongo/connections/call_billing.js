var Db = require('mongodb').Db,
    Server = require('mongodb').Server,
    logger = require('../../../../lib/util/logger'),
    config = require('../../../../lib/config/settings'),
    database = config.mongo.database.call_billing,
    connection;

module.exports = function (callback) {
    //if already we have a connection, don't connect to database again
    if (connection) {
        callback(connection);
        // logger.info("MongoDB | reusing | %s:%s ", database.host, database.port);
        return;
    }

    var db = new Db(database.name, new Server(database.host, database.port));
    db.open(function(err, db) {
        if (err) throw err;
        // store connection
        connection = db;
        logger.info("MongoDB | connected | %s:%s", database.host, database.port);
        callback(db);
    });
};