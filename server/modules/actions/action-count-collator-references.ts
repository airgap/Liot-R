import { buildCollatorReferenceCounterQuery } from '../query-builder';

/**
 * Count the number of distributors referencing one or more filter collators.
 * @name Action: Count Collator References
 * @function
 * @param {array} ids - I don't remember
 * @param {object} r - connection to the RethinkDB database
 */
export async function actionCountCollatorReferences(
	{ ids },
	r
) {
	const query = buildCollatorReferenceCounterQuery(
		Array.isArray(ids) ? ids : null,
		r
	);
	try {
		const collators = await query;
		console.log('Collators', collators);
		return { collators };
	} catch (err) {
		return {
			err: 'Error counting collator references.'
		};
	}
}
