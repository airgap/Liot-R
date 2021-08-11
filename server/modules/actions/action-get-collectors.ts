import { getCollectors } from '../get-collectors';

/**
 * Retreive one or more packet collectors
 * @name Action: Get Collators
 * @function
 * @param {object} params - request supposedly containing collector ID list
 * @param {object} r - connection to the RethinkDB database
 */
export async function actionGetCollectors({ ids }, r) {
	if (!Array.isArray(ids))
		return { err: 'No list of IDs provided.' };
	for (const id of ids)
		if (typeof id != 'string' || id.length > 55)
			return {
				err: 'Invalid (non-string) ID provided.'
			};
	try {
		const collectors = await getCollectors(r, ids);
		return { collectors };
	} catch (err) {
		return { err: 'Unable to get collectors.' };
	}
}
