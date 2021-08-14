/**
 * List nonspefic packet collators.
 * @name Database: List Collectors
 * @function
 * @param {object} r - Connection to the RethinkDB database
 * @param {number} after - skip this many collectors in query
 * @param {number} count - number of collectors to return
 * @param {string|object} order - key or method for sorting
 */
export const listCollectors = async (r, after, count, order) => {
	const total = await r.table('Collectors').count();
	if (after < 0) after += total;
	after = Math.max(0, after);
	return await r
		.table('Collectors')
		.orderBy(order)
		.slice(after, after + count);
};
