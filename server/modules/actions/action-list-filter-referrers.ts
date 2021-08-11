import {buildFilterReferrerListerQuery} from '../query-builder';
/**
 * Lists the collators referencing one or more packet filters.
 * @name Action: List Filters
 * @function
 * @param {boolean} DEBUG - enable verbose logging
 * @param {object} CONNECTION - connection to the RethinkDB database
 * @param {object} req - Express request
 * @param {object} res - Express response
 */
export async function actionListFilterReferrers({ids}, r) {
  try {
    const filters = await buildFilterReferrerListerQuery(Array.isArray(ids) ? ids : null, r);
    return {filters};
  } catch (err) {
    return {err: 'Error listing filter referrers.'};
  }
}
module.exports = actionListFilterReferrers;
