/*
 Roting Wrapper
 All rotes files handler must be added here
 */

// routing for calls charge handlers
var calls = require('./calls');

/**
 * For more routes:
 * var new_routes = require('./new_routes');
 * module.exports = [].concat(calls, new_routes);
 */


// routes wrapper
module.exports = [].concat(calls);


