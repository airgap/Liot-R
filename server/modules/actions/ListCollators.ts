import { listCollators } from '../listCollators';
import { getAfterCountOrderDirection } from '../getAfterCountOrderDirection';
export class ListCollators {
	/**
	 * List nonspecific filter collators.
	 * @name Action: List Collators
	 * @function
	 * @param {boolean} params - request params
	 * @param {object} r - connection to the RethinkDB database
	 */
	perform = async (params, r) => {
		try {
			const collators = await listCollators(
				...getAfterCountOrderDirection(r, params)
			);
			return { collators };
		} catch (err) {
			return { err: 'Unable to list collators.' };
		}
	};
}
