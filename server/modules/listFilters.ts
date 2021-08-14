/**
 * List nonspecific packet filters.
 * @name Database: List Collators
 * @function
 * @param {object} r - Connection to the RethinkDB database
 * @param {number} after - skip this many filters in query
 * @param {number} count - number of filters to return
 * @param {string|object} order - key or method for sorting
 */
export const listFilters = async (r, after, count, order) => {
	const total = await r.table('Filters').count();
	if (after < 0) after += total;
	after = Math.max(0, after);
	return await r
		.table('Filters')
		.orderBy(order)
		.slice(after, after + count)
		.coerceTo('array');
};
