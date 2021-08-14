import { deleteCollectors } from '../deleteCollectors';
import { Action } from '../Action';

/**
 * Delete one or more packet collectors.
 * @name Action: Delete Collectors
 * @function
 * @param {boolean} {ids} - request supposedly containing collector ID list
 * @param {object} r - connection to the RethinkDB database
 */
export class DeleteCollectors extends Action {
	perform = async ({ ids }, r) => {
		if (!Array.isArray(ids)) return { err: 'No list of IDs provided.' };
		for (const id of ids)
			if (typeof id != 'string' || id.length > 55)
				return { err: 'Invalid (non-string) ID provided.' };
		try {
			const deleted = deleteCollectors(r, ids);
			console.log('Deleted collectors.', deleted);
			return {};
		} catch (err) {
			return { err: 'Unable to delete collectors.' };
		}
	};
}
