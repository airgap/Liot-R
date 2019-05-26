var listFilters = require('./list-filters')
/**
 * Lists packet filters.
 * @name Action: List Filters
 * @function
 * @param {boolean} DEBUG - enable verbose logging
 * @param {object} CONNECTION - connection to the RethinkDB database
 * @param {object} req - Express request
 * @param {object} res - Express response
 */
function actionListFilters(DEBUG, CONNECTION, req, res) {
  var dat = req.body
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
  listFilters(CONNECTION, after, count, order, (err, filters) => {
    if(err) {
      res.send({err: 'Unable to query.'});
      if(DEBUG)console.log(err);
    } else {
      res.send({filters:filters});
      if(DEBUG)console.log('Queried filters.');
    }
  })
}
module.exports = actionListFilters
