/**
 * All operations over mongodb account collection are handled here.
 */

var logger = require('../../../lib/util/logger'),
    config = require('../../../lib/config/settings'),
    assert = require('assert'),
    _ = require('underscore'),
    MongoConnection = require('../mongo/connect').Connection;

var DAL_Account =  function(){};

/**
 * Insert an account into MongoDB
 * @param account
 * @param callback
 */
DAL_Account.prototype.create = function(account, callback) {
    MongoConnection.openCallBillingConnection(function (db) {
        var collection = db.collection("accounts");
        account.segment = config.segments[0];
        collection.insertOne(account, function (err, result) {
            if(err) {
                logger.error("DAL | %s | account inserting error | %j", account, err.errmsg);
                callback(err, null);
            } else
            callback(null, account._id); // the _id is filled because the database has write concern default = 1.
        });
    });
};

/**
 * Push credits, positive or negative to an account
 * @param accountName
 * @param value
 * @param callback
 */
DAL_Account.prototype.addCredits = function(accountName, value, callback) {
    // open mongodb connection
    MongoConnection.openCallBillingConnection(function (db) {
        // get the target collection
        var collection = db.collection("accounts");
        // set filter
        var _filter = {account_name: accountName};
        // set update document with a $addToSet operator, that adds an item to an array
        var _update = {
            $addToSet: {
                credits: {
                    timestamp: new Date(),
                    value: Number(value)
                }
            }
        };
        // send update to the database.
        collection.updateOne(_filter, _update, function (err, result) {
            if (err) {
                // logging erro
                logger.error("DAL | %s | account set credit error | %j", accountName, err.errmsg);
                callback(err, null);
            } else
                callback(null, result);
        });
    });
};

/**
 * Retrieve need data to set balance
 * @param accountName
 * @param callback
 */
DAL_Account.prototype.get = function (accountName, callback) {
    // open database connection
    MongoConnection.openCallBillingConnection(function (db) {
        // get the target collection
        var collection = db.collection("accounts");
        // set filter
        var _filter = {account_name: accountName};
        // set projection
        var projection = {_id: false};
        // send the command to the database.
        collection.findOne(_filter, projection, function (err, result) {
            if (err) {
                //logging error
                logger.error("DAL | %s | account set credit error | %j ", accountName, err.errmsg);
                callback(err, null);
            } else {
                callback(null, result);
            }
        });
    });
};

/**
 * Return a one account
 * @param callback
 */
DAL_Account.prototype.getOne = function (callback) {
    // open database connection
    MongoConnection.openCallBillingConnection(function (db) {
        // get the target collection
        var collection = db.collection("accounts");

        // set projection
        var projection = {_id: false};
        // send the command to the database.
        collection.findOne({}, projection, function (err, result) {
            if (err) {
                //logging error
                logger.error("DAL | get one | %j ", err.errmsg);
                callback(err, null);
            } else {
                callback(null, result);
            }
        });
    });
};


/**
 * Update account balance and segment
 * @param accountName
 * @param balance
 * @param segment
 * @param callback
 */
DAL_Account.prototype.updateBalanceAndSegment = function (accountName, balance, segment, callback) {
    // open database connection
    MongoConnection.openCallBillingConnection(function (db) {
        // get the target collection
        var collection = db.collection("accounts");
        // set filter
        var _filter = {account_name: accountName};
        // set update document with a $set operator, who does set a key value or create if not exists.
        var _update = {
            $set: {
                balance: parseFloat(balance.toFixed(2)),
                segment: segment
            }
        };
        collection.updateOne(_filter, _update, function (err, result) {
            if (err) {
                // logging error
                logger.error("DAL | %s | error on setting account balance | %j ", accountName, err.errmsg);
                callback(err, null);
            } else
                callback(null, result);
        });
    });
};

exports.DAL_Account = new DAL_Account();
