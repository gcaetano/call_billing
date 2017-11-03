/**
 * Helper contains basic function to avoid redundancy coding
 */

var logger = require('../../lib/util/logger');

var Helper =  function(){};

/**
 * Take off the first char from phone Numbers, the goal is convert +351.. in 351...
 * @param phoneNumber
 * @return {*}
 */
Helper.prototype.justNumbers = function(phoneNumber) {
    var number = phoneNumber;
    var strNumber = phoneNumber.toString();
    if (strNumber.startsWith('+')) {
        number = phoneNumber.toString().substr(1, phoneNumber.length);
    }
    return number;
};

/**
 * Check if a the given string is a date.
 * @param value
 * @return {boolean}
 */
Helper.prototype.isValidDate = function(value) {
    var dateWrapper = new Date(value);
    var valid = !isNaN(dateWrapper.getDate());
    if(!valid){
        logger.error("VAL | the value is not a date | %s ]", value);
    } else {
        logger.info("VAL | validate date ok | %s ]", value);
    }
    return !isNaN(dateWrapper.getDate());
};

/**
 * Check if a the given value is a Number.
 * @param value
 * @return {boolean}
 */
Helper.prototype.isNumber = function(value) {
    var valid = !isNaN(parseFloat(value)) && isFinite(value);
    if(!valid){
        logger.error("VAL | the value is not a number | %s ]", value);
    } else {
        logger.info("VAL | validate number ok | %s ]", value);
    }
    return valid;
};

Helper.prototype.getRandom = function (length) {
    return Math.floor(Math.pow(10, length-1) + Math.random() * 9 * Math.pow(10, length-1));
};

exports.Helper = new Helper();
