import { deleteDistributors } from '../deleteDistributors';
import { Action } from '../Action';
export class DeleteDistributors extends Action {
	/**
	 * Delete one or more packet distributors.
	 * @name Action: Delete Distributors
	 * @function
	 * @param {object} params - request params
	 * @param {object} r - connection to the RethinkDB database
	 */
	perform = async ({ ids }, r) => {
		if (!Array.isArray(ids)) return { err: 'No list of IDs provided.' };
		for (const id of ids)
			if (typeof id != 'string' || id.length > 55)
				return { err: 'Invalid (non-string) ID provided.' };
		try {
			const deleted = await deleteDistributors(r, ids);
			console.log('Deleted distributors.', deleted);
			return {};
		} catch (err) {
			console.error(err);
			return { err: 'Unable to delete distributors.' };
		}
	};
}
