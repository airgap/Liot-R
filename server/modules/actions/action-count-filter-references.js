var queryBuilder = require('../query-builder.ts');
/**
 * Count the number of collators referencing one or more packet filters.
 * @name Action: Count Filter References
 * @function
 * @param {boolean} DEBUG - enable verbose logging
 * @param {object} CONNECTION - connection to the RethinkDB database
 * @param {object} req - Express request
 * @param {object} res - Express response
 */
function actionCountFilterReferences(DEBUG, CONNECTION, req, res) {
  query = queryBuilder.buildFilterReferenceCounterQuery(Array.isArray(req.body.ids) ? req.body.ids : null);
  query.coerceTo('array').run(CONNECTION, (err, filters) => {
    if(err) {
      res.send('Error counting filter references.');
      return;
    }
    res.send({filters:filters});
  })
}
module.exports = actionCountFilterReferences;
