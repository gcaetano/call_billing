/**
 * Business rules about accounts are handled here.
 */

var logger = require('../../lib/util/logger'),
    config = require('../../lib/config/settings'),
    _ = require('underscore'),
    DAL_Account = require('../dal/mongo/account').DAL_Account,
    DAL_Calls = require('../dal/mongo/calls').DAL_Calls,
    Validate = require('../util/validates').Validate;


var BL_Account =  function(){};

/**
 * Apply a welcome bonus to a given account, then send it to insert into mongodb.
 * The "account_name" is unique:
 * The account collection has an index over "account" key that returns an error for duplicate keys.
 * @param _account
 * @param callback
 */
BL_Account.prototype.create = function(_account, callback) {
    //create a welcome bonus;
    logger.info("BL  | input %j", _account);
    var account = {};
    var result = {success: false};
    if(!validateAccount(_account)){
        logger.info("BL  | %s | the request doesn't match with the protocol", _account.account_name);
        var err = "the request doesn't match with the protocol";
        callback(err , null);
    } else {
        account = fillAccount(_account);
        // send to database
        DAL_Account.create(account, function (err, insertId) {
            if (err) {
                logger.error("BL  | %j", err);
                callback(err, undefined);
            }
            else {
                result.success = true;
                logger.info("BL  | account created | %s", insertId);
                callback(null, insertId);
            }
        });
    }
};

BL_Account.prototype.test = function(_account, callback) {
    callback(0);
};

/**
 * Apply credits to a given account
 * @param _account
 * @param callback(err, balance)
 */
BL_Account.prototype.addCredits = function(_account, callback) {
    // send to database

    if(!validateCredits(_account)){
        logger.error("BL  | %s | the parameters doesn't match with the protocol", _account.account_name);
        var err = "the parameters doesn't match with the protocol";
        callback(err, null);
    } else {
        var accountName = _account.account_name;
        var value = _account.value;
        DAL_Account.addCredits(accountName, value, function (err, credit) {
            var result = {success: false};
            if (err) {
                result.error = err.errmsg;
                logger.error("BL  | %s |  %j", _account.account_name, result);
                callback(err, null);
            }
            else {
                logger.info("BL  | %j", result);
                callback(null, credit);
            }
        });
    }
};

/**
 * Set the account balance.
 * The balance is the sum of the credits less the sum of the all charged calls.
 * @param accountName
 * @param callback
 */
BL_Account.prototype.setBalance = function(accountName, callback) {
    // get account with credits.
    DAL_Account.get(accountName, function (err, account) {
        if(account !== null) {
            // logger.info("BL  | %s | account found", account.account_name);
            if (err) {
                logger.error("BL  | account: %s | %j", accountName, err.errmsg);
                callback(err, null);
            }
            else {
                // data has all account credits
                updateBalance(account, accountName, function (balance) {
                    callback(null, balance);
                })
            }
        } else {
            err = "account not found";
            callback(err, null);
        }
    });
};

/**
 * Update the account balance, based on credits and call charged.
 * @param account has all account credits
 * @param accountName
 * @param callback
 */
function updateBalance(account, accountName, callback) {
    logger.info("BL  | %s | start update balance", accountName);
    if(account !== null) {
        var credits = sumCredits(account.credits);
        logger.info("BL  | %s | total account credits: %s", accountName, credits);
        // get and update balance
        getCallsCharges(accountName, function (charges) {
            logger.info("BL  | %s | total account charged %s", accountName, charges);
            var balance = credits - charges;
            getSegment(accountName, function (segment) {
                DAL_Account.updateBalanceAndSegment(accountName, balance, segment, function (err, result) {
                    callback(balance);
                });
            });
        });
    } else {
        callback(null);
    }
}

/**
 * Sum of all credits of an account
 * @param credits
 * @return {number}
 */
function sumCredits(credits) {
    var sum = 0;
    for (var i = 0; i< credits.length; i++){
        var credit = credits[i];
        sum+= credit.value
    }
    return sum;
}

/**
 *
 * @param accountName
 * @param callback
 */
function getSegment(accountName, callback) {
    getCurrentMonthUsage(accountName, function (err, totalSeconds) {
        logger.info("BL  | %s | figured current usage out for segment definitions [seconds: %d minutes: %d]", accountName, totalSeconds, parseFloat((totalSeconds/60).toFixed(2)));
        var segment = config.segments[0];
        if (err) {
            logger.error("BL  | %s | segment definition error | %j", accountName, err.errmsg);
            callback(null);
        } else {
            var minutes = totalSeconds / 60;
            if(minutes > 0) {
                // we want usage in minutes;
                for (var i = 0; i < config.segments.length; i++) {
                    segment = config.segments[i];
                    var from = _.first(segment.range);
                    var to = _.last(segment.range);
                    logger.info("BL  | %s | segment %s range [%d - %d], total minutes: %d", accountName , segment.alias, from, to, parseFloat((minutes).toFixed(2)));
                    if(from < minutes && (to == null || to > minutes)){
                        logger.info("BL  | %s | segment found %s [%d - %d], total minutes: %d", accountName ,segment.alias, from, to, parseFloat((minutes).toFixed(2)));
                        segment.usage = minutes;
                        break;
                    }
                }
                callback(segment)
            } else {
                segment.usage = minutes;
                callback(segment);
            }
        }
    });
}

/**
 * Det total current month duration in seconds
 * @param accountName
 * @param callback
 */
function getCurrentMonthUsage (accountName, callback) {
    var duration = 0;
    var date = new Date(), y = date.getFullYear(), m = date.getMonth();
    var from = new Date(y, m, 1);
    var to = new Date(y, m + 1, 0);
    DAL_Calls.get(accountName, from, to, function (err, docs) {
        if(err){
            logger.error("BL  | %s | current month durations error| %j", accountName, err);
            callback(err, null);
        } else {
            for (var i = 0; i < docs.length; i++) {
                var doc = docs[i];
                duration += Number(doc.event.duration);
            }
            logger.info("BL  | %s | current durations interval: [%s | %s], total: %d", accountName, from.toISOString(), to.toISOString(), duration);
            callback(null, duration);
        }
    })
}

/**
 *
 * @param accountName
 * @param callback
 */
function getCallsCharges(accountName, callback) {
    DAL_Calls.getAll(accountName, function (err, docs) {
        var charges = 0;
        if(err) {
            logger.error("BL  | call charge error | %j", err.errmsg);
            callback(charges);
        } else {
            for (var i = 0; i < docs.length; i++) {
                var doc = docs[i];
                charges += doc.cost;
            }
            callback(charges);
        }
    });
}

/**
 * Account input parameters validator
 * @param _account
 * @return {*}
 */
function validateAccount(_account) {
    return Validate.phoneNumber(_account.phone_number) && _account.account_name;
}

/**
 * Account input parameters validator
 * @param _account
 * @return {*}
 */
function validateCredits(_account) {
    return Validate.creditValue(_account.value)  && _account.account_name;
}

/**
 * Initialize an account object based on the given parameters
 * @param _account
 * @return {{}}
 */
function fillAccount(_account) {
    var account = {};
    account.phone_number = _account.phone_number;
    account.account_name = _account.account_name;
    account.credits = [];
    account.credits.push({ timestamp: new Date(), value: config.bonus.welcome});
    account.balance = config.bonus.welcome;
    return account;
}

exports.BL_Account = new BL_Account();