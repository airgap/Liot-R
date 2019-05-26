var r = require('rethinkdb')
function deleteCollators(CONNECTION, collators, callback) {
  r.table('Collators')
    .filter(doc=>{return r.expr(collators).contains(doc('id'))})
      .delete()
        .run(CONNECTION, callback)
}
module.exports = deleteCollators
