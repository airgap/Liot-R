/**
 * Retreive one or more packet distributors.
 * @name Database: Get Distributors
 * @function
 * @param {object} r - Connection to the RethinkDB database
 * @param {array} distributors - List of distributors to retrieve
 */
import { Collator } from '../../types/Collator';
import { Distributor } from '../../types/Distributor';
import { Filter } from '../../types/Filter';

export const getDistributors = (
	r,
	distributors: string[]
): Promise<Distributor<Collator<Filter>>> =>
	r
		.table('Distributors')
		.filter(doc => r.expr(distributors).contains(doc('id')))
		.merge(doc => ({
			collators: r
				.table('Collators')
				.getAll(r.args(doc('collatorIds')))
				.merge(doc => ({
					filters: r
						.table('Filters')
						.getAll(r.args(doc('filterIds')))
						.coerceTo('array')
				}))
				.coerceTo('array')
		}));
