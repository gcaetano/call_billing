/*
 Handler for charge calls.
 Keep the routing pattern like "/calls/..."
 */
var logger = require('../../lib/util/logger'),
    BL_Call = require('../bl/call').BL_Calls;

// route configurations
module.exports = [
    { method: 'POST', path: '/calls/charge', handler: charge},
    { method: 'GET', path: '/calls/list', handler: list}
];


/**
 * Method to handle calls events
 * @param request
 * @param reply
 */
function charge(request, reply) {
    var data = request.payload; // an json object are
    BL_Call.charge(data, function (err, balance) {

        var result = (err)
            ? {success: false, message: err}
            : {success: true, balance: balance};

        reply(result)
    });
}

function list(request, reply) {
    var params = request.query;
    logger.info('query params: %j', params.filter);

    var data = JSON.parse(params.filter);
    BL_Call.list(data, function (err, docs) {
        var result = (err)
            ? {success: false, message: err}
            : {success: true, data: docs};
        reply(result);
    });
}
