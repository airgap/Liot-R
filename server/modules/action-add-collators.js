var insertCollators = require('./insert-collators.js')
/**
 * Creates one or more filter collators.
 * @name Action: Add Collators
 * @function
 * @param {boolean} DEBUG - enable verbose logging
 * @param {object} CONNECTION - connection to the RethinkDB database
 * @param {object} req - Express request
 * @param {object} res - Express response
 */
function actionAddCollators(DEBUG, CONNECTION, req, res) {
  if(Array.isArray(req.body.collators)) {
    var collators = [];
    for(var collator of req.body.collators) {
      var tcol = {};
      if(typeof collator.id === "string") {
        tcol.id = collator.id;
      }
      if(typeof collator.name === "string" && collator.name.length)
        tcol.name = collator.name;
      if(Array.isArray(collator.filters)) {
        var filters = [];
        for(var filter of collator.filters) {
          if(typeof filter === 'string' && filters.indexOf(filter)==-1) {
            filters.push(filter);
          }
        }
      }
      tcol.filters = filters;
      collators.push(tcol);
    }
  }
  insertCollators(CONNECTION, collators, (err, inserted) => {
    if(err) {
      res.send({err:"Unable to create collators."});
      if(DEBUG)console.log(err);
    } else {
      res.send({});
      if(DEBUG)console.log("Created collators.");
    }
  })
}
module.exports = actionAddCollators
