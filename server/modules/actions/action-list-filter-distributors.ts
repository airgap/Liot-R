import { buildFilterReferrerListerQuery } from '../query-builder';

/**
 * Lists the distributors referencing one or more filters, recursively building the reference tree.
 * @name Action: List Filter Distributors
 * @function
 * @param {object} params - request parameters
 * @param {object} r - connection to the RethinkDB database
 */
export async function actionListFilterDistributors({ ids }, r) {
	const query = buildFilterReferrerListerQuery(
		Array.isArray(ids) ? ids : null,
		r
	);
	try {
		const filters = await query;
		return { filters };
	} catch (err) {
		return { err: 'Error listing filter referrers.' };
	}
}
