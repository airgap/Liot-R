/**
 * Retreive one or more filter collators.
 * @name Database: Get Collators
 * @function
 * @param {object} r - Connection to the RethinkDB database
 * @param {array} collators - List of collators to retrieve
 */
import { CollatorWithFilters } from '../../types/Collator';

export const getCollators = (r, collators): Promise<CollatorWithFilters[]> =>
	r
		.table('Collators')
		.filter(doc => r.expr(collators).contains(doc('id')))
		.merge(doc => ({
			filters: r
				.table('Filters')
				.getAll(r.args(doc('filterIds')))
				.coerceTo('array')
		}));
