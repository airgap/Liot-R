
/**
 * Inserts one or more packet distributors.
 * @name Database: Insert Distributors
 * @function
 * @param {object} CONNECTION - Connection to the RethinkDB database
 * @param {array} distributors - List of distributors to insert
 * @param {function} callback - Function(error, result) to execute upon success or error
 */
export const insertDistributors = (r, distributors) =>
  r.table('Distributors').insert(distributors, { conflict: 'replace' });
