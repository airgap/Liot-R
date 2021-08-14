import { listDistributors } from '../listDistributors';

import { getAfterCountOrderDirection } from '../getAfterCountOrderDirection';
import { Action } from '../Action';
export class ListDistributors extends Action {
	/**
	 * List nonspecific packet distributors.
	 * @name Action: List Distributors
	 * @function
	 * @param {object} params - request params
	 * @param {object} r - connection to the RethinkDB database
	 */
	perform = async (params, r) => {
		try {
			const distributors = await listDistributors(
				...getAfterCountOrderDirection(r, params)
			);
			return { distributors };
		} catch (err) {
			return { err: 'Unable to list distributors.' };
		}
	};
}
