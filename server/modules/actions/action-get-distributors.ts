import {getDistributors} from "../get-distributors";

/**
 * Retreive one or more packet distributors.
 * @name Action: Get Distributors
 * @function
 * @param {object} params - request supposedly containing a list of distributor IDs
 * @param {object} r - connection to the RethinkDB database
 */
export async function actionGetDistributors({ids}, r) {
    if (!Array.isArray(ids))
        return {err: "No list of IDs provided."};
    for (const id of ids)
        if (typeof id != 'string' || id.length > 55)
            return {err: 'Invalid (non-string) ID provided.'};
    try {
        const distributors = await getDistributors(r, ids);
        return {distributors};
    } catch (err) {
        return {err: 'Unable to get distributors.'};
    }
}
