import {getAfterCountOrderDirection} from "../getAfterCountOrderDirection";

import {listFilters} from "../list-filters";

/**
 * List packet filters.
 * @name Action: List Filters
 * @function
 * @param {object} params - enable verbose logging
 * @param {object} r - connection to the RethinkDB database
 */
export async function actionListFilters(params, r) {
    try {
        const filters = await listFilters(...getAfterCountOrderDirection(params, r));
        return {filters};
    } catch {
        return {err: 'Unable to query.'};
    }
}
