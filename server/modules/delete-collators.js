var r = require('rethinkdb')
module.exports = (CONNECTION, collators, callback) => {
  r.table('Collators')
    .filter(doc=>{return r.expr(dat.ids).contains(doc('id'))})
      .delete()
        .run(CONNECTION, callback)
}
