var deleteCollators = require('./delete-collators');
/**
 * Delete one or more filter collators. Exposed to API.
 * @name Action: Delete Collators
 * @function
 * @param {boolean} DEBUG - enable verbose logging
 * @param {object} CONNECTION - connection to the RethinkDB database
 * @param {object} req - Express request
 * @param {object} res - Express response
 * @param {object} dat - JSON data of the request
 */
function actionDeleteCollators(DEBUG, CONNECTION, req, res, dat) {
  if(!Array.isArray(dat.ids)) {
    res.send({err: "No list of IDs provided."});
    return;
  }
  for(var id of dat.ids)if(typeof id != 'string' || id.length > 55) { res.send({err: 'Invalid (non-string) ID provided.'}); return }
  deleteCollators(CONNECTION, dat.ids, (err, collators) => {
    if(err) {
      res.send({err: 'Unable to delete collators.'});
      if(DEBUG)console.log(err);
    } else {
      //res.send({filters:collators});
      if(DEBUG)console.log('Deleted collators.');
      if(DEBUG)console.log(collators);
    }
  })


}
module.exports = actionDeleteCollators;
