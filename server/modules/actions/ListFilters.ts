import { getAfterCountOrderDirection } from '../getAfterCountOrderDirection';

import { listFilters } from '../listFilters';
import { Action } from '../Action';
export class ListFilters extends Action {
	/**
	 * List packet filters.
	 * @name Action: List Filters
	 * @function
	 * @param {object} params - enable verbose logging
	 * @param {object} r - connection to the RethinkDB database
	 */
	perform = async (params, r) => {
		try {
			const filters = await listFilters(
				...getAfterCountOrderDirection(params, r)
			);
			return { filters };
		} catch {
			return { err: 'Unable to query.' };
		}
	};
}
