/**
 * Inserts one or more packet distributors.
 * @name Database: Insert Distributors
 * @function
 * @param {object} r - Connection to the RethinkDB database
 * @param {array} distributors - List of distributors to insert
 */
export const insertDistributors = (r, distributors) =>
	r.table('Distributors').insert(distributors, { conflict: 'replace' });
