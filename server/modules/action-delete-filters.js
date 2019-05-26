var deleteFilters = require('./delete-filters')
/**
 * Delete one or more packet filters.
 * @name Action: Delete Filters
 * @function
 * @param {boolean} DEBUG - enable verbose logging
 * @param {object} CONNECTION - connection to the RethinkDB database
 * @param {object} req - Express request
 * @param {object} res - Express response
 * @param {object} dat - JSON data of the request
 */
function actionDeleteFilters(DEBUG, CONNECTION, req, res, dat) {
  if(!Array.isArray(dat.ids)) {
    res.send({err: "No list of IDs provided."});
    return;
  }
  for(var id of dat.ids)if(typeof id !== 'string' || id.length > 55) { res.send({err: 'Invalid (non-string) ID provided.'}); return }
  deleteFilters(CONNECTION, dat.ids, (err, collators) => {
    if(err) {
      res.send({err: 'Unable to delete filters.'});
      if(DEBUG)console.log(err);
    } else {
      res.send({filters:collators});
      if(DEBUG)console.log('Deleted filters.');
      if(DEBUG)console.log(collators);
    }
  })


}
module.exports = actionDeleteFilters;
