var r = require('rethinkdb')

function getCollators(CONNECTION, collators, callback) {
  r.table('Collators')
   .filter(doc=>{return r.expr(collators).contains(doc('id'))})
     .merge(doc=>{return {filtrets:r.table('Filters').getAll(r.args(doc('filters'))).coerceTo('array')}})
       .coerceTo('array')
         .run(CONNECTION, callback)
}
module.exports = getCollators
