var r = require('rethinkdb')

function deleteCollectors(CONNECTION, collectors, callback) {
  r.table('Collectors')
    .filter(doc=>{return r.expr(collectors).contains(doc('id'))})
      .delete()
        .run(CONNECTION, callback)
}
module.exports = deleteCollectors
