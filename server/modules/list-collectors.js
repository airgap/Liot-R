var r = require('rethinkdb')

function listCollectors(CONNECTION, after, count, order, direction, callback) {
  r.table('Collectors').count().run(CONNECTION, (err, total) => {
    if(err) {
      callback(err)
    } else {
      if(after<0)after += total;
      after = Math.max(0,after);
      var query = r.table('Collectors')
        .orderBy(order)
          .slice(after, after + count)
            .coerceTo('array')
              .run(CONNECTION, callback)
    }

  })
}
module.exports = listCollectors
