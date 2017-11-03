/**
 * Validate contains function to validate input values
 */

var Helper = require('./helper').Helper;

var Validate =  function(){};

/**
 * Check it a given value is a date.
 * @param value
 * @return {boolean}
 */
Validate.prototype.isValidDate = function (value) {
    return Helper.isValidDate(value);
};

/**
 * Number validator.
 * @param value
 * @return {*|boolean}
 */
Validate.prototype.creditValue = function (value) {
    return value && Helper.isNumber(value);
};

/**
 * This function takes off the first char from a given value and check if the rest a number.
 * @param phoneNumber
 * @return {boolean}
 */
Validate.prototype.phoneNumber = function (phoneNumber) {
    return (phoneNumber)
        ? Helper.isNumber(Helper.justNumbers(phoneNumber))
        : false;
};

exports.Validate = new Validate();