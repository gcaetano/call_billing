/**
 * All operations over mongodb calls collection are handled here.
 */

var logger = require('../../../lib/util/logger'),
    config = require('../../../lib/config/settings'),
    assert = require('assert'),
    _ = require('underscore'),
    MongoConnection = require('../mongo/connect').Connection;

var DAL_Calls =  function(){};

/**
 * Retrieve all calls made from a account in an interval
 * @param accountName
 * @param from
 * @param to
 * @param callback
 */
DAL_Calls.prototype.get = function(accountName, from, to, callback) {
    MongoConnection.openCallBillingConnection(function (db) {
        // get the target collection
        var collection = db.collection("calls");
        // set filter
        var _filter = {account_name: accountName, timestamp: {$gte: new Date(from), $lte: new Date(to)}};

        //sort by timestamp order ascending
        var sort = {timestamp: 1};

        // send the command to the database.
        collection.find(_filter).sort(sort).toArray(function (err, docs) {
            if (err) {
                //logging error
                logger.error("DAL | %s | retrieving call error | %j", accountName, err);
                callback(err, null);
            } else {
                logger.info("DAL | %s | record found %j", accountName, docs.length);
                callback(null, docs);
            }
        });
    });
};

/**
 * Retrieve all calls made from a account
 * @param account
 * @param callback
 */
DAL_Calls.prototype.getAll = function(account, callback) {
    MongoConnection.openCallBillingConnection(function (db) {
        // get the target collection
        var collection = db.collection("calls");
        // set filter
        var _filter = {account_name: account};

        // send the command to the database.
        logger.info("DAL | %s | calls list request", account);

        collection.find(_filter).toArray(function (err, docs) {
            if (err) {
                //logging error
                logger.error("DAL | %s | calls list request error | %j", account, err.errmsg);
                callback(err, null);
            } else {
                logger.info("DAL | %s | calls list request | total calls found: %s ", account, docs.length);
                callback(null, docs);
            }
        });
    });
};

/**
 * Insert an call event
 * @param event
 * @param rate
 * @param total_cost
 * @param callback
 */
DAL_Calls.prototype.addCall = function(event, rate, total_cost, callback) {
    // open mongodb connection
    MongoConnection.openCallBillingConnection(function (db) {
        // get the target collection
        var calls = db.collection("calls");
        var account = db.collection("accounts");
        var filter = {account_name: event.account_name};
        account.findOne(filter, function (err, replay) {
            // check if the account exists
            if (replay && !_.isEmpty(replay)) {
                logger.info("DAL | %s | account found", replay.account_name);

                // document with a call info
                var account = { timestamp: new Date(), cost: parseFloat(total_cost.toFixed(2)) , rate: rate,  event: _.omit(event, 'account_name'), account_name: event.account_name };

                // send account document to the database.
                calls.insertOne(account, function (err, result) {
                    if (err) {
                        // logging error
                        logger.error("DAL | %s | call insert error | %j", account, err.errmsg);
                        callback(err, null);
                    } else
                        callback(null, result);
                });
            } else {
                // logging error
                logger.info("DAL | %s | account not found ", event.account_name);
                callback({}, null);
            }
        });
    });
};

exports.DAL_Calls = new DAL_Calls();
