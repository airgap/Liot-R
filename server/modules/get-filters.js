var r = require('rethinkdb');



function getFilters(CONNECTION, filters, callback) {
  var query = r.table('Filters')
    .filter(doc=>{return r.expr(filters).contains(doc('id'))})
        .coerceTo('array')
          .run(CONNECTION, callback)
}
module.exports = getFilters
