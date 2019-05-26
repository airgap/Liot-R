var r = require('rethinkdb')

function listCollators(CONNECTION, after, count, order, direction, callback) {
  r.table('Collators').count().run(CONNECTION, (err, total) => {
    if(err) {
      callback(err)
    } else {
      if(after<0)after += total;
      after = Math.max(0,after);
      var query = r.table('Collators')
        .orderBy(order)
          .slice(after, after + count).merge(doc=>{return {filtrets:r.table('Filters').getAll(r.args(doc('filters'))).coerceTo('array')}})
            .coerceTo('array')
              .run(CONNECTION, callback)
    }

  })
}
module.exports = listCollators
