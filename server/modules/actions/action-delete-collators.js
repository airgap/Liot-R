var deleteCollators = require('../delete-collators');
/**
 * Delete one or more filter collators. Exposed to API.
 * @name Action: Delete Collators
 * @function
 * @param {boolean} DEBUG - enable verbose logging
 * @param {object} CONNECTION - connection to the RethinkDB database
 * @param {object} req - Express request
 * @param {object} res - Express response
 */
function actionDeleteCollators(DEBUG, CONNECTION, req, res) {
  if(!Array.isArray(req.body.ids)) {
    res.send({err: "No list of IDs provided."});
    return;
  }
  for(var id of req.body.ids)if(typeof id != 'string' || id.length > 55) { res.send({err: 'Invalid (non-string) ID provided.'}); return }
  deleteCollators(CONNECTION, req.body.ids, (err, collators) => {
    if(err) {
      res.send({err: 'Unable to delete collators.'});
      if(DEBUG)console.log(err);
    } else {
      res.send({collators:collators});
      if(DEBUG)console.log('Deleted collators.');
      if(DEBUG)console.log(collators);
    }
  })
}
module.exports = actionDeleteCollators;
