/* THIS FUNCTION IS INCOMPLETE AND NOT READY FOR PRODUCTION */
import { actionPushUpdate } from './action-push-update';

/**
 * Push multiple update simultaneously for batch processing. Currently not fully implemented.
 * @name Action: Push Updates
 * @function
 * @param {object} params - request params
 * @param {object} r - connection to the RethinkDB database
 */
export function actionPushUpdates(params, r) {
	if (!Array.isArray(params.updates))
		return { err: 'No updates specified.' };
	return Promise.allSettled(
		params.updates.map(update =>
			actionPushUpdate(update, r)
		)
	);
}
