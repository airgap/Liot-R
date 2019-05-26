var getDistributors = require('./get-distributors')
/**
 * Retreives one or more packet distributors.
 * @name Action: Get Distributors
 * @function
 * @param {boolean} DEBUG - enable verbose logging
 * @param {object} CONNECTION - connection to the RethinkDB database
 * @param {object} req - Express request
 * @param {object} res - Express response
 * @param {object} dat - JSON data of the request
 */
function actionGetDistributors(DEBUG, CONNECTION, req, res, dat) {
  if(!Array.isArray(dat.ids)) {
    res.send({err: "No list of IDs provided."});
    return;
  }
  for(var id of dat.ids)if(typeof id != 'string' || id.length > 55) { res.send({err: 'Invalid (non-string) ID provided.'}); return }
  var query = getDistributors(CONNECTION, dat.ids, (err, distros) => {
    if(err) {
      res.send({err: 'Unable to get distributors.'});
      if(DEBUG)console.log(err);
    } else {
      res.send({distributors:distros});
      if(DEBUG)console.log('Got distributors.');
      if(DEBUG)console.log(distros);
    }
  })


}
module.exports = actionGetDistributors;
