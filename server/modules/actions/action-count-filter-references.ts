import {buildFilterReferenceCounterQuery} from '../query-builder';

/**
 * Count the number of collators referencing one or more packet filters.
 * @name Action: Count Filter References
 * @function
 * @param {array} ids - I don't remember
 * @param {object} r - connection to the RethinkDB database
 */
export async function actionCountFilterReferences({ids}, r) {
    const query = buildFilterReferenceCounterQuery(Array.isArray(ids) ? ids : null, r);
    try {
        const filters = await query.coerceTo('array');
        return {filters};
    } catch(e) {
        return {err: 'Error counting filter references.'};
    }
}
