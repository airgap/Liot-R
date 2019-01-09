var r = require('rethinkdb');
/**
 * Lists packet collectors.
 * @name Action: List Collectors
 * @function
 * @param {boolean} DEBUG - enable verbose logging
 * @param {object} CONNECTION - connection to the RethinkDB database
 * @param {object} req - Express request
 * @param {object} res - Express response
 * @param {object} dat - JSON data of the request
 */
module.exports = (DEBUG, CONNECTION, req, res, dat) => {
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
  r.table('Collectors').count().run(CONNECTION, (err, total) => {
    if(err) {

    } else {
      if(after<0)after += total;
      after = Math.max(0,after);
      var query = r.table('Collectors')
        .orderBy(order)
          .slice(after, after + count)
            .coerceTo('array')
              .run(CONNECTION, (err, collectors) => {
                if(err) {
                  res.send({err: 'Unable to query.'});
                  if(DEBUG)console.log(err);
                } else {
                  res.send({collectors:collectors});
                  if(DEBUG)console.log('Queried collectors.');
                  if(DEBUG)console.log(collectors);
                }
              })
    }

  })


}
