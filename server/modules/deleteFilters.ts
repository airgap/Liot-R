/**
 * Delete one or more packet filters.
 * @name Database: Delete Filters
 * @function
 * @param {object} r - Connection to the RethinkDB database
 * @param {array} filters - List of filter IDs to delete
 */
import { WriteResult } from 'rethinkdb';
export const deleteFilters = (r, filters: string[]): Promise<WriteResult> =>
	r
		.table('Filters')
		.filter(doc => {
			return r.expr(filters).contains(doc('id'));
		})
		.delete();
