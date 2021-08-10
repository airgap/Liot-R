/**
 * Inserts one or more filter collators.
 * @name Database: Insert Collators
 * @function
 * @param {object} CONNECTION - Connection to the RethinkDB database
 * @param {array} collators - List of collators to insert
 * @param {function} callback - Function(error, result) to execute upon success or error
 */
export const insertCollators = (r, collators)  =>
  r.table('Collators').insert(collators, { conflict: 'replace' })
