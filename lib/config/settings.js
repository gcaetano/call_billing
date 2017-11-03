/**
 * Created by Giuliano Ferreira Caetano on 08/03/2017.
 * All configs must be placed here
 */
var config = {
    log4js: {
        file: './lib/config/log4js.json',
        appender: 'dateFile',
        route: {
            default: 'default'
        }
    },
    mongo: {
        database: {
            call_billing: {
                host: "localhost",
                port: 27017,
                name: "call_billing",
                collections: {
                    accounts: "accounts",
                    calls: "calls"
                }
            }
        }
    },
    server: {
        host: 'localhost',
        port: 8008
    },
    bonus: {
        welcome: 20
    },
    cost:{
        margin: 0.05,
        talkdesk: 0.01,
        us: 0.03,
        uk: 0.06,
        external: 0.01
    },
    types: {
        inbound: 'in',
        outbound: 'out'
    },
    segments: [
        {
            alias: "starter",
            range: [0, 100],
            discount: 0
        },{
            alias: "basic",
            range: [101, 300],
            discount: 0
        },{
            alias: "upper",
            range: [301, 400],
            discount: 10
        }, {
            alias: "supper",
            range: [401, 500],
            discount: 15
        }, {
            alias: "ultra",
            range: [501, 600],
            discount: 18
        }, {
            alias: "mega",
            range: [601, null],
            discount: 22
        }
    ]
};

module.exports = config;