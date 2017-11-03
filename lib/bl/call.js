/**
 * Business rules about calls.
 */

var logger = require('../../lib/util/logger'),
    config = require('../../lib/config/settings'),
    Twilio = require('../../lib/bl/twilio').Twilio,
    DAL_Calls = require('../dal/mongo/calls').DAL_Calls,
    DAL_Account = require('../dal/mongo/account').DAL_Account,
    BL_Account = require('../../lib/bl/account').BL_Account,
    Validate = require('../../lib/util/validates').Validate;

var BL_Calls =  function(){};

/**
 * Retrieve all calls from an account
 * @param accountName
 * @param callback
 */
BL_Calls.prototype.getAll = function(accountName, callback) {
    logger.info("BL  |%j", {account: accountName, message: "call list request"});
    DAL_Calls.getAll(accountName, function (err, docs) {
        if (err)
            logger.error("BL  |%j", {account: accountName, message: "call list request", error: err.errmsg});
        callback(err, docs);
    })
};

/**
 * Retrieve all calls made from a account between an interval
 * @param accountName
 * @param from
 * @param to
 * @param callback
 */
BL_Calls.prototype.get = function(accountName, from, to, callback) {
    logger.info("BL  | %s | call list request", accountName);
    DAL_Calls.get(accountName, from, to, function (err, docs) {
        if (err)
            logger.error("BL  | %s | call list request | %j", accountName, err.errmsg);
        callback(err, docs);
    })
};

/**
 * get back a call list of an account
 * @param data
 * @param callback
 */
BL_Calls.prototype.list = function(data, callback) {
    if (!validateData(data)) {
        logger.error("BL  | %s | the request doesn't match with the protocol", data.account_name);
        var message = "the request doesn't match with the protocol";
        callback(message, null);
    }
    else {
        logger.info("BL  | %s | call list request [from: %s| to: %s]", data.account_name, data.from, data.to);
        DAL_Calls.get(data.account_name, data.from, data.to, function (err, docs) {
            if (err) logger.error("BL  | %s | call list request | %j", data.account_name, err.errmsg);
            callback(err, docs);
        })
    }
};

/**
 * Call events handler
 * @param event
 * @param callback
 */
BL_Calls.prototype.charge = function(event, callback) {
    if(!validateEvent(event)) {
        logger.error("BL  | %s | the event doesn't match with the protocol | %j", event.account_name, err);
        var err = "the event doesn't match with the protocol";
        callback(err, null);
    } else {
        getCost(event, function (rate) {
            // send charge to database to inset a call
            // if the call was inserted, so we need to update the balance.
            var total_cost = rate.cost * (event.duration / 60);

            DAL_Calls.addCall(event, rate, total_cost, function (err, call_rate) {
                if (err) {
                    logger.error("BL  | %s | call charge error on addCall| %j", event.account_name, err);
                    callback(err, null);
                }
                else {
                    BL_Account.setBalance(event.account_name, function (err, balance) {
                        if (!balance) {
                            logger.info("BL  | %s | call charge error on setBalance | %j", event.account_name, err);
                            callback(err, null);
                        } else {
                            logger.info("BL  | %s | call charge applied | %j", event.account_name, total_cost);
                            callback(null, balance);
                        }
                    });
                }
            });
        });
    }
};

/**
 * To calculate the price per minute for inbounds is as follows: talkdesk_number_cost + external_number_cost + profit_margin
 * @param event
 * @param callback
 */
function getCost(event, callback) {
    /**
     The talkdesk_number_cost should be set to 1c except for two cases: US and UK Toll free numbers which should be set to 3c and 6c, respectively.
     The external_number_cost should be set to 1c if the call is answered in the web browser,
     otherwise the price to charge should be the same as Twilio charges for calls to that number.
     */

    logger.info("BL  | %s | event arrived | %j", event.account_name, event);


    // Set the external number cost.
    var external_number_cost = config.cost.external;
    if(event.forwarded_phone_number != null) {
        // means the call was not answered on the browser, it was forwarded.
        var forwardTwilioRate = Twilio.getRate(event.forwarded_phone_number);
        external_number_cost = forwardTwilioRate.rate;
    }

    // Set the talkdesk number cost.
    var talkdeskRate = Twilio.getRate(event.talkdesk_phone_number);
    var talkdesk_number_cost = getTalkdeskCost(talkdeskRate);

    // talkdesk margin.
    getTalkdeskMargin(event.account_name, function (talkdesk_margin) {
        var cost = {
            talkdesk_number_cost: talkdesk_number_cost,
            external_number_cost: external_number_cost,
            talkdesk_margin: talkdesk_margin,
            cost: talkdesk_number_cost + external_number_cost + talkdesk_margin
        };

        logger.info("BL  | %s | cost to apply | %j", event.account_name, cost);

        callback(cost);
    });
}

/**
 * Get the talkdesk margin based on the account segment.
 * @param accountName
 * @param callback
 */
function getTalkdeskMargin(accountName, callback) {
    var talkdesk_margin = config.cost.margin;
    getAccount(accountName, function (account) {
        if(account){
            var segment = account.segment;
            if(segment.discount >= 0 && segment.discount <= 100){
                var tax = segment.discount/100;
                var discount = talkdesk_margin * tax;
                var margin = talkdesk_margin - discount;
                callback(margin);
                logger.info("BL  | %s | talkdesk margin | tax: %d | discount: %d | margin %d", accountName, tax, discount, margin);
            } else
                callback(talkdesk_margin);
        } else {
            logger.info("BL  | %s | talkdesk margin | margin %s", accountName, talkdesk_margin);
            callback(talkdesk_margin)
        }
    })
}

/**
 * Getting account from database
 * @param accountName
 * @param callback
 */
function getAccount(accountName, callback) {
    DAL_Account.get(accountName, function (err, account) {
        callback(account);
    })
}

/**
 * Just to define whether uses twilio or not
 * @param twilioRate
 * @return {number}
 */
function getTalkdeskCost(twilioRate) {
    var cost = config.cost.talkdesk;
    switch (twilioRate.country){
        case "United States":
            cost = config.cost.us;
            break;
        case "United Kingdom":
            cost = config.cost.uk;
            break;
    }
    return cost;
}

function validateData(data) {
    return data.account_name && Validate.isValidDate(data.from) && Validate.isValidDate(data.to);
}

function validateEvent(event) {
    return (
        event.account_name && event.duration &&
        Validate.phoneNumber(event.talkdesk_phone_number) &&
        Validate.phoneNumber(event.customer_phone_number) &&
            (event.forwarded_phone_number == null) || Validate.phoneNumber(event.forwarded_phone_number)
    );
}

exports.BL_Calls = new BL_Calls();
