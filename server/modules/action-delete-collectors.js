var deleteCollectors = require('./delete-collectors')
/**
 * Delete one or more packet collectors.
 * @name Action: Delete Collectors
 * @function
 * @param {boolean} DEBUG - enable verbose logging
 * @param {object} CONNECTION - connection to the RethinkDB database
 * @param {object} req - Express request
 * @param {object} res - Express response
 */
function actionDeleteCollectors(DEBUG, CONNECTION, req, res) {
  if(!Array.isArray(req.body.ids)) {
    res.send({err: "No list of IDs provided."});
    return;
  }
  for(var id of req.body.ids)if(typeof id != 'string' || id.length > 55) { res.send({err: 'Invalid (non-string) ID provided.'}); return }
  deleteCollectors(CONNECTION, req.body.ids,  (err, deleted) => {
    if(err) {
      res.send({err: 'Unable to delete collectors.'});
      if(DEBUG)console.log(err);
    } else {
      res.send({});
      if(DEBUG)console.log('Deleted collectors.');
      if(DEBUG)console.log(deleted);
    }
  })
}
module.exports = actionDeleteCollectors
