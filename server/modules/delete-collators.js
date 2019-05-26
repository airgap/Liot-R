var r = require('rethinkdb')
module.exports = (CONNECTION, collators, callback) => {
  r.table('Collators')
    .filter(doc=>{return r.expr(collators).contains(doc('id'))})
      .delete()
        .run(CONNECTION, callback)
}
