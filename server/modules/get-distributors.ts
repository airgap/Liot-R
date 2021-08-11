/**
 * Retreive one or more packet distributors.
 * @name Database: Get Distributors
 * @function
 * @param {object} r - Connection to the RethinkDB database
 * @param {array} distributors - List of distributors to retrieve
 */
export const getDistributors = (r, distributors) =>
    r.table('Distributors')
        .filter(doc => {
            return r.expr(distributors).contains(doc('id'))
        })
        .merge(doc => ({
            collators:
                r.table('Collators')
                    .getAll(r.args(doc('collators')))
                    .merge(doc => ({
                        filters:
                            r.table('Filters')
                                .getAll(r.args(doc('filters')))
                                .coerceTo('array')
                    })).coerceTo('array')
        }));