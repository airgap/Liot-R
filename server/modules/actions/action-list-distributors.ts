import {listDistributors} from "../list-distributors";

import {getAfterCountOrderDirection} from "../getAfterCountOrderDirection";

/**
 * List nonspecific packet distributors.
 * @name Action: List Distributors
 * @function
 * @param {object} params - request params
 * @param {object} r - connection to the RethinkDB database
 */
export async function actionListDistributors(params, r) {
    try {
        const distributors = await listDistributors(...getAfterCountOrderDirection(r, params));
        return {distributors};
    } catch (err) {
        return {err: 'Unable to list distributors.'};
    }
}
