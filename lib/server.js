/**
 * Server config
 * The web server will use hapi https://hapijs.com/tutorials/
 */

var config = require('../lib/config/settings'),
    Mongo = require('./dal/mongo/connect').Connection,
    Hapi = require("hapi"),
    routes = require('../lib/routes'), // all routes come from here
    logger = require('../lib/util/logger');

// config server
var server = new Hapi.Server();

var Server =  function(){};
Server.prototype.start = function () {

    Mongo.openCallBillingConnection(function () {

        server.connection({host: config.server.host, port: config.server.port});

        // routes config
        server.route(routes);

        //server start
        server.start(function () {
            logger.info('HTTP started:', server.info.uri);
            console.log('HTTP started:', server.info.uri);
        });
    });
};

Server.prototype.stop = function () {
    server.stop();
};

exports.Server = new Server();