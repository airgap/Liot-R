var getFilters = require('../get-filters')
/**
 * Retreive the contents of one or more packet filters.
 * @name Action: Get Filters
 * @function
 * @param {boolean} DEBUG - enable verbose logging
 * @param {object} CONNECTION - connection to the RethinkDB database
 * @param {object} req - Express request
 * @param {object} res - Express response
 */
function actionGetFilters (DEBUG, CONNECTION, req, res) {
  if(!Array.isArray(req.body.ids)) {
    res.send({err: "No list of IDs provided."});
    return;
  }
  for(var id of req.body.ids)if(typeof id != 'string' || id.length > 55) { res.send({err: 'Invalid (non-string) ID provided.'}); return }
  getFilters(CONNECTION, req.body.ids, (err, collators) => {
    if(err) {
      res.send({err: 'Unable to getfilters.'});
      if(DEBUG)console.log(err);
    } else {
      res.send({filters:collators});
      if(DEBUG)console.log('Got filters.');
      if(DEBUG)console.log(collators);
    }
  })
}
module.exports = actionGetFilters
