var r = require('rethinkdb');
/**
 * Modify packet distributors. Will not insert new distributors if nonexistent IDs are provided.
 * @name Action: Modify Distributors
 * @function
 * @param {boolean} DEBUG - enable verbose logging
 * @param {object} CONNECTION - connection to the RethinkDB database
 * @param {object} req - Express request
 * @param {object} res - Express response
 * @param {object} dat - JSON data of the request
 */
function actionModDistributors(DEBUG, CONNECTION, req, res, dat) {
  if(Array.isArray(dat.distributors)) {
    var distributors = [];
    for(var distributor of dat.distributors) {
      var trans = {sources:[]}
      if(Array.isArray(distributor.sources)) {
        for(var source of distributor.sources) {
          trans.sources.push(source);
        }
      }
      distributors.push(trans);
    }
    r.table('Distributors').update(distributors).run(CONNECTION, (err, updated) => {
      if(err) {
        res.send({err:'Error updating distributors.'});
        if(DEBUG)console.log(err);
      } else {
        res.send({});
        if(DEBUG)console.log('Updated distributors.');
      }
    })
  }
}
module.exports = actionModDistributors;
