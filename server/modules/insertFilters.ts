/**
 * Inserts one or more packet filters.
 * @name Database: Insert Filters
 * @function
 * @param {object} r - Connection to the RethinkDB database
 * @param {array} filters - List of filters to insert
 */
import { Filter } from '../../types/Filter';
import { WriteResult } from 'rethinkdb';

export const insertFilters = (r, filters: Filter[]): Promise<WriteResult> =>
	r.table('Filters').insert(filters, { conflict: 'replace' });
