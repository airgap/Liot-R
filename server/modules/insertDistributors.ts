/**
 * Inserts one or more packet distributors.
 * @name Database: Insert Distributors
 * @function
 * @param {object} r - Connection to the RethinkDB database
 * @param {array} distributors - List of distributors to insert
 */
import { Distributor } from '../../types/Distributor';
import { WriteResult } from 'rethinkdb';

export const insertDistributors = (
	r,
	distributors: Distributor[]
): Promise<WriteResult> =>
	r.table('Distributors').insert(distributors, { conflict: 'replace' });
