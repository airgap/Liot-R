import { validUrl } from 'valid-url';
import { request } from 'express';
import { Action } from '../Action';
import { pushUpdate } from '../pushUpdate';
export class PushUpdate extends Action {
	perform = async (params, r) => {
		const newUpdate: any = {};
		if (typeof params.accessor !== 'string')
			return { err: 'No accessor specified.' };

		if (['undefined', 'null'].includes(typeof params.value))
			return { err: 'No value specified.' };
		if (typeof params.id === 'string') {
			newUpdate.id = params.id;
			return;
		}
		newUpdate.accessor = params.accessor;
		newUpdate.value = params.value;
		//idsAndAccessors.push({id:dat.id,accessor:dat.accessor});
		//var idsExpr = r.expr(idsAndAccessors);
		return await pushUpdate(newUpdate, r);
	};
}
/**
 * Push an update to a collector.
 * Does not require admin access to perform; any client with a valid Accessor can push an update.
 * @name Action: Push Update
 * @function
 * @param {object} params - request params
 * @param {object} r - connection to the RethinkDB database
 */
