var r = require('rethinkdb');
/**
 *
 * @name Database: Get Filters
 * @function
 * @param {object} CONNECTION - Connection to the RethinkDB database
 * @param {array} - list of filters to retrieve
 * @param {function} callback - Function(error, result) to execute upon success or error
 */



function getFilters(CONNECTION, filters, callback) {
  var query = r.table('Filters')
    .filter(doc=>{return r.expr(filters).contains(doc('id'))})
        .coerceTo('array')
          .run(CONNECTION, callback)
}
module.exports = getFilters
