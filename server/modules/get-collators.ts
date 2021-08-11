/**
 * Retreive one or more filter collators.
 * @name Database: Get Collators
 * @function
 * @param {object} r - Connection to the RethinkDB database
 * @param {array} collators - List of collators to retrieve
 */
export const getCollators = (r, collators) =>
	r
		.table('Collators')
		.filter(doc =>
			r.expr(collators).contains(doc('id'))
		)
		.merge(doc => ({
			filtrets: r
				.table('Filters')
				.getAll(r.args(doc('filters')))
				.coerceTo('array')
		}))
		.coerceTo('array');
