var r = require('rethinkdb');



function getFilters(CONNECTION, filters, callback) {
  var query = r.table('Filters')
    .filter(doc=>{return r.expr(dat.ids).contains(doc('id'))})
        .coerceTo('array')
          .run(CONNECTION, callback)
}
module.exports = getFilters
