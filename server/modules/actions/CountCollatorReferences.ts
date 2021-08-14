import { buildCollatorReferenceCounterQuery } from '../query-builder';
import { Action } from '../Action';
export class CountCollatorReferences extends Action {
	/**
	 * Count the number of distributors referencing one or more filter collators.
	 * @name Action: Count Collator References
	 * @function
	 * @param {array} ids - I don't remember
	 * @param {object} r - connection to the RethinkDB database
	 */
	perform = async ({ ids }, r) => {
		const query = buildCollatorReferenceCounterQuery(
			Array.isArray(ids) ? ids : null,
			r
		);
		try {
			const collators = await query;
			console.log('Collators', collators);
			return { collators };
		} catch (err) {
			return { err: 'Error counting collator references.' };
		}
	};
}
