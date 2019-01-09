var queryBuilder = require('./query-builder.js');
/**
 * Count the number of collators referencing one or more packet filters.
 * @name Action: Count Filter References
 * @function
 * @param {boolean} DEBUG - enable verbose logging
 * @param {object} CONNECTION - connection to the RethinkDB database
 * @param {object} req - Express request
 * @param {object} res - Express response
 * @param {object} dat - JSON data of the request
 */
function actionCountFilterReferences(DEBUG, CONNECTION, req, res, dat) {
  query = queryBuilder.buildFilterReferenceCounterQuery(Array.isArray(dat.ids) ? dat.ids : null);
  query.coerceTo('array').run(CONNECTION, (err, filters) => {
    if(err) {
      res.send('Error counting filter references.');
      return;
    }
    res.send({filters:filters});
  })
}
module.exports = actionCountFilterReferences;
