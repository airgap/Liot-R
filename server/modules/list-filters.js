var r = require('rethinkdb')
/**
 * List nonspecific packet filters.
 * @name Database: List Collators
 * @function
 * @param {object} CONNECTION - Connection to the RethinkDB database
 * @param {number} after - skip this many filters in query
 * @param {number} count - number of filters to return
 * @param {string|object} order - key or method for sorting
 * @param {function} callback - Function(error, result) to execute upon success or error
 */
function listFilters(CONNECTION, after, count, order, callback) {
  r.table('Filters').count().run(CONNECTION, (err, total) => {
    if(err) {

    } else {
      if(after<0)after += total;
      after = Math.max(0,after);
      var query = r.table('Filters')
        .orderBy(order)
          .slice(after, after + count)
            .coerceTo('array')
              .run(CONNECTION, callback)
    }

  })
}
module.exports = listFilters
