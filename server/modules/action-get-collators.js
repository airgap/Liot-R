var getCollators = require('./get-collators')
/**
 * Retreives one or more filter collators.
 * @name Action: Delete Collators
 * @function
 * @param {boolean} DEBUG - enable verbose logging
 * @param {object} CONNECTION - connection to the RethinkDB database
 * @param {object} req - Express request
 * @param {object} res - Express response
 */
function actionGetCollators(DEBUG, CONNECTION, req, res) {
  if(!Array.isArray(req.body.ids)) {
    res.send({err: "No list of IDs provided."});
    return;
  }
  for(var id of req.body.ids)if(typeof id != 'string' || id.length > 55) { res.send({err: 'Invalid (non-string) ID provided.'}); return }
  getCollators(CONNECTION, req.body.ids, (err, collators) => {
    if(err) {
      res.send({err: 'Unable to get collators.'});
      if(DEBUG)console.log(err);
    } else {
      res.send({collators:collators});
      if(DEBUG)console.log('Got collators.');
      if(DEBUG)console.log(collators);
    }
  })


}
module.exports = actionGetCollators;
