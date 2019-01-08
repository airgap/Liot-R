exports = (req, res, dat) => {
  var after = 0,
  count = 100,
  orders = ['smart','name', 'id'],
  order = 'smart',
  directions = ['ascending', 'descending'],
  direction = 'ascending';
  if(typeof dat.after == 'number') {
    after = dat.after;
  }
  if(typeof dat.count == 'number' && dat.count >= 0 && dat.count < 1001) {
    count = dat.count;
  }
  if(typeof dat.order === 'string' && dat.order in orders) {
    order = orders[dat.order];
  }
  if(typeof dat.direction === 'string' && dat.direction in directions) {
    direction = dat.direction;
  }
  if(direction == 'descending') order = r.desc(order)
  //var col = new Intl.Collator(undefined, {numeric: true, sensitivity: 'base'});
  var reg = /([A-Za-z]+|[0-9]+|.+?)/g;
  r.table('Collators').count().run(CONNECTION, (err, total) => {
    if(err) {

    } else {
      if(after<0)after += total;
      after = Math.max(0,after);
      var query = r.table('Collators')
        .orderBy(order)
          .slice(after, after + count).merge(doc=>{return {filtrets:r.table('Filters').getAll(r.args(doc('filters'))).coerceTo('array')}})
            .coerceTo('array')
              .run(CONNECTION, (err, collators) => {
                if(err) {
                  res.send({err: 'Unable to query.'});
                  if(DEBUG)console.log(err);
                } else {
                  res.send({collators:collators});
                  if(DEBUG)console.log('Queried collators.');
                  if(DEBUG)console.log(collators);
                }
              })
    }

  })


}
