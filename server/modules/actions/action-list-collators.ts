import {listCollators} from "../list-collators";

/**
 * List nonspecific filter collators.
 * @name Action: List Collators
 * @function
 * @param {boolean} params - request params
 * @param {object} r - connection to the RethinkDB database
 */
export async function actionListCollators({after, count, order, direction}, r) {
    if (typeof after !== 'number' || after < 0)
        after = 0;

    if (typeof count !== 'number' || count < 0 || count > 1000)
        count = 100;

    if (typeof order !== 'string' || !['smart', 'name', 'id'].includes(order))
        order = 'smart';

    if (typeof direction !== 'string' || !['ascending', 'descending'].includes(direction))
        direction = 'ascending';

    if (direction == 'descending')
        order = r.desc(order);
    try {
        const collators = await listCollators(r, after, count, order);
        return {collators};
    } catch (err) {
        return {err: 'Unable to list collators.'};
    }
}
