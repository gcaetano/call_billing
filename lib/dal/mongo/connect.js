
var db_call_billing = require('../mongo/connections/call_billing');

var dbCallBilling;
var Connection =  function(){};

/**
 * Open and store the call_billing database connection
 * @returns mongo db call_billing connection
 */
Connection.prototype.openCallBillingConnection = function(callback){
    db_call_billing(function (db) {
        dbCallBilling = db;
        callback();
    });
};

/**
 * Returns the stored call_billing database connection
 * @returns mongo db call_billing connection
 */
Connection.prototype.getCallBillingConnection = function(){
    return dbCallBilling;
};

exports.Connection = new Connection();