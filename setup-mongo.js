var Db = require('mongodb').Db,
    Server = require('mongodb').Server,
    assert = require('assert'),
    config = require('./config/settings');

var database = config.mongo.database.call_billing;

var db = new Db(database.name, new Server(database.host, database.port));

// Establish connection to db
db.open(function(err, db) {
    // create accounts collection
    db.createCollection(database.collections.accounts, function (err, accounts) {
        console.log("accounts collection: ok");

        // create index over account_name field ASC
        accounts.createIndex('account_name', {w: 1}, function (err, indexName) {
            assert.equal("account_name_1", indexName);
            console.log("accounts collection index: ok");
        });

        // create calls collection
        db.createCollection(database.collections.calls, function (err, calls) {
            console.log("calls collection: ok");

            // create index over account_name field ASC
            calls.createIndex('account_name', {w: 1}, function (err, indexName) {
                assert.equal("account_name_1", indexName);
                console.log("calls collection index: ok");
            });
        });
    })
});