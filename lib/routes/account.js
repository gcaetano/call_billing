/*
 Handler for charge account.
 Keep the routing pattern like"/account/..."
 */

var logger = require('../../lib/util/logger'),
    BL_Account = require('../bl/account').BL_Account;

// route configurations
module.exports = [
    { method: 'POST', path: '/account/create', handler: create},
    { method: 'POST', path: '/account/credit', handler: addCredits}
];

/**
 * Method to create a new account
 * @param request
 * @param reply '{success: true, _id: "" }'
 */
function create(request, reply) {
    var account = request.payload;
    BL_Account.create(account, function (err, insert) {
        var result = (err)
            ? {success: false, message: err}
            : {success: true, id: insert};

        reply(result);
    });
}

/**
 * Apply credits to a given account
 * @param request
 * @param reply '{success: true, balance: value}'
 */
function addCredits(request, reply) {
    var account = request.payload;

    // logger.info("RT  | recharge account request |%j", account);
    BL_Account.addCredits(account, function (err, insert) {
        if(!err) {
            BL_Account.setBalance(account.account_name, function (err, balance) {
                var result = (err)
                    ? {success: false, message: err}
                    : {success: true, balance: balance};

                reply(result);
            });
        } else {
            var result = {success: false, message: err};
            reply(result);
        }
    });
}
