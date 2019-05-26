var insertFilters = require('./insert-filters');
var COMPARATORS = [
  "EQUALS",
  "NEQUALS",
  "TFEQUALS",
  "TFNEQUALS",
  "OVER",
  "OVEROR",
  "UNDER",
  "UNDEROR",
]

var OPERATORS = [
  "AND",
  "OR",
  "NAND",
  "NOR",
  "XOR",
  "SAME",
]
/**
 * Creates one or more packet filters.
 * @name Action: Add Filters
 * @function
 * @param {boolean} DEBUG - enable verbose logging
 * @param {object} CONNECTION - connection to the RethinkDB database
 * @param {object} req - Express request
 * @param {object} res - Express response
 * @param {object} dat - JSON data of the request
 */
module.exports = (DEBUG, CONNECTION, req, res, dat) => {
  if(Array.isArray(dat.filters)) {
    var filters = [];
    for(var filter of dat.filters) {
      var trans = {};
      if(typeof filter.name === "string") {
        trans.name = filter.name;
      }
      if(typeof filter.id === "string") {
        trans.id = filter.id;
      }
      if(typeof filter.code === "string") {
        var code = filter.code;
        var json;
        try {
          json = JSON.parse(code);
          //err();
        } catch(error) {
          err('Invalid JSON.');
          return;
        }
        if(DEBUG)console.log(json)
        recur(json);
        function recur(tree, current) {
        //if(DEBUG)console.log(tree, current);
        var top = typeof current == 'undefined';
          if(!top && (typeof tree[current] === 'number' || typeof tree[current] === 'string')) {
            if(!COMPARATORS.includes(current)) {
              err('All numbers and strings must reside in comparators.');
              return;
            }
          } else if(!Array.isArray(tree)) {
            if(!top && current && !OPERATORS.includes(current)) {
              err('Not a valid operator.');
              return;
            }
            var keys = Object.keys(tree);
            if(DEBUG)console.log(top && keys.length != 1)
              if(top && keys.length != 1) {
                err("Root object must contain exactly one object, not " + keys.length);
                return;
              }
            if(top || keys.length === 2) {
              for(var key of keys) {
                if(COMPARATORS.includes(key)) {
                  recur(tree[key], key);
                } else if(OPERATORS.includes(key)) {
                  recur(tree[key], key);
                } else {
                  err('Invalid comparator or operator.');
                  return;
                }
              }
            } else {
              err('Operator ' + current + ' expects 2 parameters, not ' + keys.length);
              return;
            }
          } else if(Array.isArray(tree)) {
            if(DEBUG)console.log('array: ' + current);
            if(!COMPARATORS.includes(current)) {
              err('Invalid comparator.');
              return;
            }
            if(tree.length != 2) {
              err('All comparators expect 2 parameters. Found ' + tree.length);
              return;
            }
          }
        }
        trans.code = filter.code;
        trans.json = json;
      }
      filters.push(trans);
    }
    insertFilters(CONNECTION, filters, (err, created) => {
      if(err) {
        res.send({err:'Error creating filters.'});
        if(DEBUG)console.log(err);
      } else {
        res.send({});
        if(DEBUG)console.log('Created filters.');
      }
    })
  }
  function err(text) { res.send({err: text}); if(DEBUG)console.log(text) }
}
