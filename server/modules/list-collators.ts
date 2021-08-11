/**
 * Lists filter collators.
 * @name Database: List Collators
 * @function
 * @param {object} r - Connection to the RethinkDB database
 * @param {number} after - skip this many collators in query
 * @param {number} count - number of collators to return
 * @param {string|object} order - key or method for sorting
 */

export const listCollators = async (
	r,
	after,
	count,
	order
) => {
	const total = await r.table('Collators').count();
	if (after < 0) after += total;
	after = Math.max(0, after);
	return await r
		.table('Collators')
		.orderBy(order)
		.slice(after, after + count)
		.merge(doc => ({
			filtrets: r
				.table('Filters')
				.getAll(r.args(doc('filters')))
				.coerceTo('array')
		}));
};
