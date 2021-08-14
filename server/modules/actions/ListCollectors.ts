import { listCollectors } from '../listCollectors';
import { getAfterCountOrderDirection } from '../getAfterCountOrderDirection';
import { Action } from '../Action';
export class ListCollectors extends Action {
	/**
	 * List nonspecific packet collectors.
	 * @name Action: List Collectors
	 * @function
	 * @param {object} params - request params
	 * @param {object} r - connection to the RethinkDB database
	 */

	perform = async (params, r) => {
		try {
			const collectors = await listCollectors(
				...getAfterCountOrderDirection(r, params)
			);
			return { collectors };
		} catch (err) {
			return { err: 'Unable to list collectors.' };
		}
	};
}
