/**
 * Retreive one or more packet collectors.
 * @name Database: Get Collectors
 * @function
 * @param {object} r - Connection to the RethinkDB database
 * @param {array} collectors - List of collectors to retrieve
 */
import { Collector } from '../../types/Collector';

export const getCollectors = async (
	r,
	collectors: string[]
): Promise<Collector[]> =>
	r.table('Collectors').filter(doc => r.expr(collectors).contains(doc('id')));
