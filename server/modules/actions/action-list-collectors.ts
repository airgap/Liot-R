import { listCollectors } from '../list-collectors';
import { getAfterCountOrderDirection } from '../getAfterCountOrderDirection';

/**
 * List nonspecific packet collectors.
 * @name Action: List Collectors
 * @function
 * @param {object} params - request params
 * @param {object} r - connection to the RethinkDB database
 */

export async function actionListCollectors(params, r) {
	try {
		const collectors = await listCollectors(
			...getAfterCountOrderDirection(r, params)
		);
		return { collectors };
	} catch (err) {
		return { err: 'Unable to list collectors.' };
	}
}
