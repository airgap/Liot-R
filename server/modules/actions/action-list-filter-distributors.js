var queryBuilder = require('../query-builder.ts');
/**
 * Lists the distributors referencing one or more filters, recursively building the reference tree.
 * @name Action: List Filter Distributors
 * @function
 * @param {boolean} DEBUG - enable verbose logging
 * @param {object} CONNECTION - connection to the RethinkDB database
 * @param {object} req - Express request
 * @param {object} res - Express response
 */
function actionListFilterDistributors(DEBUG, CONNECTION, req, res) {
  var query = queryBuilder.buildFilterReferrerListerQuery(Array.isArray(req.body.ids) ? req.body.ids : null);
  query.coerceTo('array').run(CONNECTION, (err, filters) => {
    if(err) {
      res.send('Error listing filter referrers.');
      return;
    }
    res.send({filters:filters});
  })
}
module.exports = actionListFilterDistributors;
