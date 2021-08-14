import { buildFilterReferenceCounterQuery } from '../query-builder';
import { Action } from '../Action';

export class CountFilterReferences extends Action {
	/**
	 * Count the number of collators referencing one or more packet filters.
	 * @name Action: Count Filter References
	 * @function
	 * @param {array} ids - I don't remember
	 * @param {object} r - connection to the RethinkDB database
	 */
	perform = async ({ ids }, r) => {
		const query = buildFilterReferenceCounterQuery(
			Array.isArray(ids) ? ids : null,
			r
		);
		try {
			const filters = await query.coerceTo('array');
			return { filters };
		} catch (e) {
			return { err: 'Error counting filter references.' };
		}
	};
}
