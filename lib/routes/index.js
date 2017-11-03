/*
 Routes Wrapper
 All rotes files handler must be added here
 */

// routing for calls charge handlers
var account = require('./account');
var call = require('./call');

/**
 * For more routes:
 * var new_routes = require('./new_routes');
 * module.exports = [].concat(account, new_routes);
 */


// routes wrapper
module.exports = [].concat(account, call);