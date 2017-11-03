/**
 * Server config
 * The web server will use hapi https://hapijs.com/tutorials/
 */

var config = require('../config/settings'),
    Mongo = require('./dal/mongo/connect').Connection,
    Hapi = require("hapi"),
    routes = require('../lib/routes'), // all routes come from here
    logger = require('../lib/logger');


var Server =  function(){};
Server.prototype.start = function () {

    // Mongo.openCallBillingConnection(function () {
        // config server
        var server = new Hapi.Server();
        server.connection({host: config.server.host,port: config.server.port});

        // routes config
        server.route(routes);

        //server start
        server.start(function () {
            logger.info('HTTP started:', server.info.uri);
        });
    // });
};


exports.Server = new Server();