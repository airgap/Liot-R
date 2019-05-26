var getCollectors = require('./get-collectors')
/**
 * Retreive one or more packet collectors
 * @name Action: Get Collators
 * @function
 * @param {boolean} DEBUG - enable verbose logging
 * @param {object} CONNECTION - connection to the RethinkDB database
 * @param {object} req - Express request
 * @param {object} res - Express response
 */
function actionGetCollectors(DEBUG, CONNECTION, req, res) {
  if(!Array.isArray(req.body.ids)) {
    res.send({err: "No list of IDs provided."});
    return;
  }
  for(var id of req.body.ids)if(typeof id != 'string' || id.length > 55) { res.send({err: 'Invalid (non-string) ID provided.'}); return }
  getCollectors(CONNECTION, req.body.ids, (err, collators) => {
    if(err) {
      res.send({err: 'Unable to get collectors.'});
      if(DEBUG)console.log(err);
    } else {
      res.send({collectors:collators});
      if(DEBUG)console.log('Got collectors.');
      if(DEBUG)console.log(collators);
    }
  })
}
module.exports = actionGetCollectors;
