var r = require('rethinkdb')
/**
 *
 * @name Database: List Collators
 * @function
 * @param {object} CONNECTION - Connection to the RethinkDB database
 * @param {number} after - skip this many collators in query
 * @param {number} count - number of collators to return
 * @param {string|object} order - key or method for sorting
 * @param {function} callback - Function(error, result) to execute upon success or error
 */

function listCollators(CONNECTION, after, count, order, callback) {
  r.table('Collators').count().run(CONNECTION, (err, total) => {
    if(err) {
      callback(err)
    } else {
      if(after<0)after += total;
      after = Math.max(0,after);
      var query = r.table('Collators')
        .orderBy(order)
          .slice(after, after + count).merge(doc=>{return {filtrets:r.table('Filters').getAll(r.args(doc('filters'))).coerceTo('array')}})
            .coerceTo('array')
              .run(CONNECTION, callback)
    }

  })
}
module.exports = listCollators
