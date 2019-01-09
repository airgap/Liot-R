var r = require('rethinkdb');
/**
 * Retreives one or more packet collectors.
 * @name Action: Get Collators
 * @function
 * @param {boolean} DEBUG - enable verbose logging
 * @param {object} CONNECTION - connection to the RethinkDB database
 * @param {object} req - Express request
 * @param {object} res - Express response
 * @param {object} dat - JSON data of the request
 */
function actionGetCollectors(DEBUG, CONNECTION, req, res, dat) {
  if(!Array.isArray(dat.ids)) {
    res.send({err: "No list of IDs provided."});
    return;
  }
  for(var id of dat.ids)if(typeof id != 'string' || id.length > 55) { res.send({err: 'Invalid (non-string) ID provided.'}); return }
  var query = r.table('Collectors')
    .filter(doc=>{return r.expr(dat.ids).contains(doc('id'))})
      .coerceTo('array')
        .run(CONNECTION, (err, collators) => {
          if(err) {
            res.send({err: 'Unable to query.'});
            if(DEBUG)console.log(err);
          } else {
            res.send({collectors:collators});
            if(DEBUG)console.log('Queried collectors.');
            if(DEBUG)console.log(collators);
          }
        })


}
module.exports = actionGetCollectors;
