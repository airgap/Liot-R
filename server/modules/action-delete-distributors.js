var r = require('rethinkdb');
/**
 * Delete one or more packet distributors.
 * @name Action: Delete Distributors
 * @function
 * @param {boolean} DEBUG - enable verbose logging
 * @param {object} CONNECTION - connection to the RethinkDB database
 * @param {object} req - Express request
 * @param {object} res - Express response
 * @param {object} dat - JSON data of the request
 */
function actionDeleteDistributors(DEBUG, CONNECTION, req, res, dat) {
  if(!Array.isArray(dat.ids)) {
    res.send({err: "No list of IDs provided."});
    return;
  }
  for(var id of dat.ids)if(typeof id != 'string' || id.length > 55) { res.send({err: 'Invalid (non-string) ID provided.'}); return }
  deleteDistributors(CONNECTION, dat.ids, (err, deleted) => {
    if(err) {
      res.send({err: 'Unable to delete distributors.'});
      if(DEBUG)console.log(err);
    } else {
      res.send({});
      if(DEBUG)console.log('Deleted distributors.');
      if(DEBUG)console.log(collators);
    }
  })


}
module.exports = actionDeleteDistributors;
