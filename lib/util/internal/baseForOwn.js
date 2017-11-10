const baseFor = require( './baseFor');
const keys = require( '../keys');

/**
 * The base implementation of `forOwn`.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Object} Returns `object`.
 */
function baseForOwn(object, iteratee) {
	return object && baseFor(object, iteratee, keys);
}

module.exports = baseForOwn;
