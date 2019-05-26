var r = require('rethinkdb')

function deleteFilters(CONNECTION, filters, callback) {
  r.table('Filters')
    .filter(doc=>{return r.expr(filters).contains(doc('id'))})
      .delete()
        .run(CONNECTION, callback)
}
module.exports = deleteFilters
