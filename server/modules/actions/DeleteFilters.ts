import { deleteFilters } from '../deleteFilters';
import { Action } from '../Action';
export class DeleteFilters extends Action {
	/**
	 * Delete one or more packet filters.
	 * @name Action: Delete Filters
	 * @function
	 * @param {array} params - request supposedly containing filter IDs
	 * @param {object} r - connection to the RethinkDB database
	 */
	perform = async ({ ids }, r) => {
		if (!Array.isArray(ids)) return { err: 'No list of IDs provided.' };
		for (const id of ids)
			if (typeof id !== 'string' || id.length > 55)
				return { err: 'Invalid (non-string) ID provided.' };
		try {
			const filters = await deleteFilters(r, ids);
			console.log('Deleted filters', filters);
			return {};
		} catch (err) {
			return { err: 'Unable to delete filters.' };
		}
	};
}
