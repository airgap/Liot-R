/**
 * List nonspecific packet distributors.
 * @name Database: List Collators
 * @function
 * @param {object} r - Connection to the RethinkDB database
 * @param {number} after - skip this many distributors in query
 * @param {number} count - number of distributors to return
 * @param {string|object} order - key or method for sorting
 */
export const listDistributors = async (r, after, count, order) => {
    const total = await r.table('Distributors').count();
    if (after < 0) after += total;
    after = Math.max(0, after);
    return await r.table('Distributors')
        .orderBy(order)
        .slice(after, after + count).merge(doc => ({
            collets: r.table('Collators').getAll(r.args(doc('collators')))
                .merge(doc => ({
                    filtrets: r.table('Filters').getAll(r.args(doc('filters'))).coerceTo('array')
                })).coerceTo('array')
        }))
}
