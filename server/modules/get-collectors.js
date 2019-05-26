var r = require('rethinkdb')

function getCollectors(CONNECTION, collectors, callback) {
  r.table('Collectors')
    .filter(doc=>{return r.expr(collectors).contains(doc('id'))})
      .coerceTo('array')
        .run(CONNECTION, callback)
}
module.exports = getCollectors
