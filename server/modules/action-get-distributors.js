var r = require('rethinkdb');
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
  var query = r.table('Distributors')
    .filter(doc=>{return r.expr(dat.ids).contains(doc('id'))})
      .merge(doc=>{
        return {
          collators:
            r.table('Collators')
              .getAll(r.args(doc('collators')))
                .merge(doc=>{
                  return {
                    filters:
                      r.table('Filters')
                        .getAll(r.args(doc('filters')))
                            .coerceTo('array')
                  }
                }).coerceTo('array')
          }
        })
        .coerceTo('array')
          .run(CONNECTION, (err, collators) => {
            if(err) {
              res.send({err: 'Unable to query.'});
              if(DEBUG)console.log(err);
            } else {
              res.send({distributors:collators});
              if(DEBUG)console.log('Queried distributors.');
              if(DEBUG)console.log(collators);
            }
          })


}
module.exports = actionGetDistributors;
