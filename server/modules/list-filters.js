var r = require('rethinkdb')

function listFilters(CONNECTION, after, count, order, direction, callback) {
  r.table('Filters').count().run(CONNECTION, (err, total) => {
    if(err) {

    } else {
      if(after<0)after += total;
      after = Math.max(0,after);
      var query = r.table('Filters')
        .orderBy(order)
          .slice(after, after + count)
            .coerceTo('array')
              .run(CONNECTION, callback)
    }

  })
}
module.exports = listFilters
