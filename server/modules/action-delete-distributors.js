var deleteDistributors = require('./delete-distributors');
/**
 * Delete one or more packet distributors.
 * @name Action: Delete Distributors
 * @function
 * @param {boolean} DEBUG - enable verbose logging
 * @param {object} CONNECTION - connection to the RethinkDB database
 * @param {object} req - Express request
 * @param {object} res - Express response
 */
function actionDeleteDistributors(DEBUG, CONNECTION, req, res) {
  if(!Array.isArray(req.body.ids)) {
    res.send({err: "No list of IDs provided."});
    return;
  }
  for(var id of req.body.ids)if(typeof id != 'string' || id.length > 55) { res.send({err: 'Invalid (non-string) ID provided.'}); return }
  deleteDistributors(CONNECTION, req.body.ids, (err, deleted) => {
    if(err) {
      res.send({err: 'Unable to delete distributors.'});
      if(DEBUG)console.log(err);
    } else {
      res.send({});
      if(DEBUG)console.log('Deleted distributors.');
      if(DEBUG)console.log(deleted);
    }
  })
}
module.exports = actionDeleteDistributors;
