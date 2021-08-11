/**
 * Inserts one or more filter collators.
 * @name Database: Insert Collators
 * @function
 * @param {object} r - Connection to the RethinkDB database
 * @param {array} collators - List of collators to insert
 */
export const insertCollators = (r, collators)  =>
  r.table('Collators').insert(collators, { conflict: 'replace' })
