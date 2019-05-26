var r = require('rethinkdb')
/**
 * List nonspefic packet collators.
 * @name Database: List Collectors
 * @function
 * @param {object} CONNECTION - Connection to the RethinkDB database
 * @param {number} after - skip this many collectors in query
 * @param {number} count - number of collectors to return
 * @param {string|object} order - key or method for sorting
 * @param {function} callback - Function(error, result) to execute upon success or error
 */
function listCollectors(CONNECTION, after, count, order, callback) {
  r.table('Collectors').count().run(CONNECTION, (err, total) => {
    if(err) {
      callback(err)
    } else {
      if(after<0)after += total;
      after = Math.max(0,after);
      var query = r.table('Collectors')
        .orderBy(order)
          .slice(after, after + count)
            .coerceTo('array')
              .run(CONNECTION, callback)
    }

  })
}
module.exports = listCollectors
