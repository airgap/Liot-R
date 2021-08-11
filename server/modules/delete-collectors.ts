/**
 * Delete one or more packet collectors.
 * @name Database: Delete Collectors
 * @function
 * @param {object} r - Connection to the RethinkDB database
 * @param {array} collectors - List of collector IDs to delete
 */
export const deleteCollectors = (r, collectors) =>
	r
		.table('Collectors')
		.filter(doc => r.expr(collectors).contains(doc('id')))
		.delete();
