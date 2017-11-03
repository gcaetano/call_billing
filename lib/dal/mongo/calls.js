
var logger = require('../../../lib/logger'),
    config = require('../../../config/settings'),
    MongoConnection = require('../mongo/connect').Connection;

var Data =  function(){};


Data.prototype.charge = function(status, today, callback) {
    var serviceDatabase = MongoConnection.getCallBillingConnection();
};


Data.prototype.bill = function(status, today, callback) {
    var serviceDatabase = MongoConnection.getCallBillingConnection();

};

exports.Data = new Data();
