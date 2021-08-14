import { Action } from '../Action';

/**
 * Delete one or more filter collators. Exposed to API.
 * @name Action: Delete Collators
 * @function
 * @param {object} params - request params
 * @param {object} r - connection to the RethinkDB database
 */
export class DeleteCollators extends Action {
	perform = async function deleteCollators({ ids }, r) {
		if (!Array.isArray(ids)) return { err: 'No list of IDs provided.' };
		for (const id of ids)
			if (typeof id != 'string' || id.length > 55)
				return { err: 'Invalid (non-string) ID provided.' };
		try {
			const collators = await deleteCollators(r, ids);
			console.log('Deleted collators.', collators);
			return { collators: collators };
		} catch (err) {
			return { err: 'Unable to delete collators.' };
		}
	};
}
