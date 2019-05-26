var r = require('rethinkdb')

function getDistributors(CONNECTION, distributors, callback) {
  r.table('Distributors')
    .filter(doc=>{return r.expr(distributors).contains(doc('id'))})
      .merge(doc=>{
        return {
          collators:
            r.table('Collators')
              .getAll(r.args(doc('collators')))
                .merge(doc=>{
                  return {
                    filters:
                      r.table('Filters')
                        .getAll(r.args(doc('filters')))
                            .coerceTo('array')
                  }
                }).coerceTo('array')
          }
        })
        .coerceTo('array')
          .run(CONNECTION, callback)
}
module.exports = getDistributors
