var r = require('rethinkdb')

function deleteDistributors(CONNECTION, distributors, callback) {
  r.table('Distributors')
    .filter(doc=>{return r.expr(distributors).contains(doc('id'))})
      .delete()
        .run(CONNECTION, callback)
}
module.exports = deleteDistributors
