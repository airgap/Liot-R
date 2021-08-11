import {getFilters} from "../get-filters";

/**
 * Retreive the contents of one or more packet filters.
 * @name Action: Get Filters
 * @function
 * @param {object} params - request params supposedly containing a list of filter IDs
 * @param {object} r - connection to the RethinkDB database
 */
async function actionGetFilters({ids}, r) {
    if (!Array.isArray(ids))
        return {err: "No list of IDs provided."};
    for (const id of ids)
        if (typeof id != 'string' || id.length > 55)
            return {err: 'Invalid (non-string) ID provided.'};
    try {
        const filters = await getFilters(r, ids);
        return {filters};
    } catch (err) {
        return {err: 'Unable to get filters.'};
    }
}
