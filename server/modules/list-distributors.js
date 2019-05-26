var r = require('rethinkdb')
/**
 *
 * @name Database: List Collators
 * @function
 * @param {object} CONNECTION - Connection to the RethinkDB database
 * @param {number} after - skip this many distributors in query
 * @param {number} count - number of distributors to return
 * @param {string|object} order - key or method for sorting
 * @param {function} callback - Function(error, result) to execute upon success or error
 */

function listDistributors(CONNECTION, after, count, order, callback) {
  r.table('Distributors').count().run(CONNECTION, (err, total) => {
    if(err) {

    } else {
      if(after<0)after += total;
      after = Math.max(0,after);
      var query = r.table('Distributors')
        .orderBy(order)
          .slice(after, after + count).merge(doc=>{return {collets:r.table('Collators').getAll(r.args(doc('collators')))
  .merge(doc=>{return {filtrets:r.table('Filters').getAll(r.args(doc('filters'))).coerceTo('array')}})
          .coerceTo('array')}})
            .coerceTo('array')
              .run(CONNECTION, callback)
    }

  })
}
module.exports = listDistributors
