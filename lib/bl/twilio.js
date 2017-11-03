/**
 * Rates handler,
 * All operations over rates.json file are handled here
 */

var logger = require('../../lib/util/logger'),
    twilio = require('../dal/twilio.json'),
    Helper = require('../util/helper').Helper;


var Twilio = function (){};

/**
 * Method to retrieve the rate to apply to a phone number
 * @param phoneNumber ("+351961918192" or 351961918192)
 * @return {{highest: undefined, country: undefined, rate: undefined, number: *}}
 */
Twilio.prototype.getRate = function(phoneNumber){
    var number = Helper.justNumbers(phoneNumber);
    var match = {highest: undefined, country: undefined, rate: undefined, number: number};
    for (var i = 0; i < twilio.length; i++) {
        var country = twilio[i];
        for (var j = 0; j < country.rates.length ; j++) {
            var rate = country.rates[j].rate;
            var startWith = country.rates[j].start_with;
            for (var k = 0; k < startWith.length; k++) {
                var sw = startWith[k];
                if (number.startsWith(sw.toString())) {
                    // for the first time
                    if (typeof match.highest === "undefined") {
                        match.highest = sw;
                        match.rate = rate;
                        match.country = country.country;
                    }
                    // override, if the phone number has the highest matching.
                    else if (sw.toString().length >= match.highest.toString().length) {
                        match.highest = sw;
                        match.rate = rate;
                        match.country = country.country;
                    }
                }
            }
        }
    }
    return match;
};



exports.Twilio = new Twilio();