/**
 * Created by Giuliano Ferreira Caetano on 08/03/2017.
 * All configs must be placed here
 */
var config = {
    log4js: {
        file: './config/log4js.json',
        appender: 'dateFile',
        route: {
            default: 'default'
        }
    },
    mongo: {
        database: {
            call_billing: {
                host: "127.0.0.1",
                port: 27017,
                name: "call_billing",
                collections: {
                    rates: "rates",
                    users: "users",
                    track: "track"
                }
            }
        }
    },
    server: {
        host: 'localhost',
        port: 8000
    }
};

module.exports = config;