import { WriteResult } from 'rethinkdb';
import { Collector } from '../../types/Collector';

/**
 * Inserts one or more packet collectors.
 * @name Database: Insert Collectors
 * @function
 * @param {object} r - Connection to the RethinkDB database
 * @param {array} collectors - List of collectors to insert
 */
export const insertCollectors = (
	r,
	collectors: Collector[]
): Promise<WriteResult> =>
	r.table('Collectors').insert(collectors, { conflict: 'replace' });
