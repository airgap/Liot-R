/* THIS FUNCTION IS INCOMPLETE AND NOT READY FOR PRODUCTION */
import { PushUpdate } from './PushUpdate';
import { Action } from '../Action';
export class PushUpdates extends Action {
	/**
	 * Push multiple update simultaneously for batch processing. Currently not fully implemented.
	 * @name Action: Push Updates
	 * @function
	 * @param {object} params - request params
	 * @param {object} r - connection to the RethinkDB database
	 */
	perform = async (params, r) => {
		if (!Array.isArray(params.updates))
			return { err: 'No updates specified.' };
		return Promise.allSettled(
			params.updates.map(update => PushUpdate.perform(update, r))
		);
	};
}
