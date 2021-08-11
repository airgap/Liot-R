/**
 * Delete one or more packet distributors.
 * @name Database: Delete Distributors
 * @function
 * @param {object} r - Connection to the RethinkDB database
 * @param {array} distributors - List of distributor IDs to delete
 */
export const deleteDistributors = (r, distributors) =>
	r
		.table('Distributors')
		.filter(doc => {
			return r.expr(distributors).contains(doc('id'));
		})
		.delete();
