/**
 * List nonspecific packet distributors.
 * @name Database: List Collators
 * @function
 * @param {object} r - Connection to the RethinkDB database
 * @param {number} after - skip this many distributors in query
 * @param {number} count - number of distributors to return
 * @param {string|object} order - key or method for sorting
 */
import { DistributorWithCollators } from '../../types/Distributor';
import { CollatorWithFilters } from '../../types/Collator';

export const listDistributors = async (
	r,
	after,
	count,
	order
): Promise<DistributorWithCollators<CollatorWithFilters>[]> => {
	const total = await r.table('Distributors').count();
	if (after < 0) after += total;
	after = Math.max(0, after);
	return await r
		.table('Distributors')
		.orderBy(order)
		.slice(after, after + count)
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
};
