var queryBuilder = require('./query-builder.js');
/**
 * Count the number of distributors referencing one or more filter collators.
 * @name Action: Count Collator References
 * @function
 * @param {boolean} DEBUG - enable verbose logging
 * @param {object} CONNECTION - connection to the RethinkDB database
 * @param {object} req - Express request
 * @param {object} res - Express response
 * @param {object} dat - JSON data of the request
 */
function actionCountCollatorReferences(DEBUG, CONNECTION, req, res, dat) {
  query = queryBuilder.buildCollatorReferenceCounterQuery(Array.isArray(dat.ids) ? dat.ids : null);
  query.coerceTo('array').run(CONNECTION, (err, collators) => {
    if(err) {
      res.send('Error counting collator references.');
      return;
    }
    res.send({collators:collators});
  })
}
module.exports = actionCountCollatorReferences;
