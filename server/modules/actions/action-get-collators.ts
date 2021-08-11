import {getCollators} from "../get-collators";

/**
 * Retreive one or more filter collators.
 * @name Action: Delete Collators
 * @function
 * @param {object} params - request supposedly containing collator IDs
 * @param {object} r - connection to the RethinkDB database
 */
export async function actionGetCollators({ids}, r) {
    if (!Array.isArray(ids))
        return {err: "No list of IDs provided."};
    for (const id of ids)
        if (typeof id != 'string' || id.length > 55)
            return {err: 'Invalid (non-string) ID provided.'};
    try {
        const collators = await getCollators(r, ids);
        console.log('Got collators', collators);
        return {collators};
    } catch (err) {
        console.error(err);
        return {err: 'Unable to get collators.'};
    }
}
