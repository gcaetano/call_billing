/*
 Handler for calls charge.
 Keep the routing pattern like"/calls/..."
 */

var logger = require('../../lib/logger');

// route configurations
module.exports = [
    { method: 'POST',  path: '/calls/list', handler: list },
    { method: 'GET', path: '/calls/charge', handler: charge }
];

/**
 * Method to add a call charge
 * @param request
 * @param reply
 */
function charge(request, reply) {
    logger.info('the call was started');
    return reply('{"success": true , "message": "the call was charger"}');
}

/**
 * Method to list a call list
 * @param request
 * @param reply
 */
function list(request, reply) {
    logger.info(request.payload.charge);
    return reply({"success": true , "balance": 65.42});
}