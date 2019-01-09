var queryBuilder = require('./query-builder.js');
/**
 * Lists the distributors referencing one or more filters, recursively building the reference tree.
 * @name Action: List Filter Distributors
 * @function
 * @param {boolean} DEBUG - enable verbose logging
 * @param {object} CONNECTION - connection to the RethinkDB database
 * @param {object} req - Express request
 * @param {object} res - Express response
 * @param {object} dat - JSON data of the request
 */
function actionListFilterDistributors(DEBUG, CONNECTION, req, res, dat) {
  var query = queryBuilder.buildFilterReferrerListerQuery(Array.isArray(dat.ids) ? dat.ids : null);
  query.coerceTo('array').run(CONNECTION, (err, filters) => {
    if(err) {
      res.send('Error listing filter referrers.');
      return;
    }
    res.send({filters:filters});
  })
}
module.exports = actionListFilterDistributors;
