import { listCollators } from '../list-collators';
import { getAfterCountOrderDirection } from '../getAfterCountOrderDirection';

/**
 * List nonspecific filter collators.
 * @name Action: List Collators
 * @function
 * @param {boolean} params - request params
 * @param {object} r - connection to the RethinkDB database
 */
export async function actionListCollators(params, r) {
	try {
		const collators = await listCollators(
			...getAfterCountOrderDirection(r, params)
		);
		return { collators };
	} catch (err) {
		return { err: 'Unable to list collators.' };
	}
}
