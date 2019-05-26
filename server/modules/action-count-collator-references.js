var queryBuilder = require('./query-builder.js');
/**
 * Count the number of distributors referencing one or more filter collators.
 * @name Action: Count Collator References
 * @function
 * @param {boolean} DEBUG - enable verbose logging
 * @param {object} CONNECTION - connection to the RethinkDB database
 * @param {object} req - Express request
 * @param {object} res - Express response
 */
function actionCountCollatorReferences(DEBUG, CONNECTION, req, res) {
  var query = queryBuilder.buildCollatorReferenceCounterQuery(Array.isArray(req.body.ids) ? req.body.ids : null);
  query.coerceTo('array').run(CONNECTION, (err, collators) => {
    if(err) {
      res.send({err:'Error counting collator references.'});
      return;
    }
    console.log('Collators', collators)
    res.send({collators:collators});
  })
}
module.exports = actionCountCollatorReferences;
