var r = require('rethinkdb');
/**
 * Creates one or more filter collators.
 * @name Action: Add Collators
 * @function
 * @param {boolean} DEBUG - enable verbose logging
 * @param {object} CONNECTION - connection to the RethinkDB database
 * @param {object} req - Express request
 * @param {object} res - Express response
 * @param {object} dat - JSON data of the request
 */
module.exports = (DEBUG, CONNECTION, req, res, dat) => {
  if(Array.isArray(dat.collators)) {
    var collators = [];
    for(var collator of dat.collators) {
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
        /*r.table('Filters').filter(r.expr(filters).contains(r.row('id'))).count().run(CONNECTION, (err, count) => {
          if(count == filters.length) {
            r.table('Collectors').insert()
          }
        })*/
      }
      tcol.filters = filters;
      collators.push(tcol);
    }
  }
  r.table('Collators').insert(collators, { conflict: 'replace' }).run(CONNECTION, (err, inserted) => {
    if(err) {
      res.send({err:"Unable to create collators."});
        if(DEBUG)console.log(err);
    } else {
      res.send({});
      if(DEBUG)console.log("Created collators.");
    }
  })
}
