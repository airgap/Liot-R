var queryBuilder = require('../query-builder.ts');

/**
 * Count the number of distributors referencing one or more filter collators.
 * @name Action: Count Collator References
 * @function
 * @param {boolean} DEBUG - enable verbose logging
 * @param {object} CONNECTION - connection to the RethinkDB database
 * @param {object} req - Express request
 * @param {object} res - Express response
 */
async function actionCountCollatorReferences({ids}, r) {
    const query = queryBuilder.buildCollatorReferenceCounterQuery(
        Array.isArray(ids)
            ? ids
            : null,
        r
    );
    try {
        const collators = await query;
        console.log('Collators', collators);
        return {collators};
    } catch (err) {
        return {err: 'Error counting collator references.'};
    }
}

module.exports = actionCountCollatorReferences;
