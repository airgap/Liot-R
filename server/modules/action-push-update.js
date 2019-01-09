var r = require('rethinkdb');
/**
 * Push an update to a collector.
 * Does not require admin access to perform; any client with a valid Accessor can push an update.
 * @name Action: Push Update
 * @function
 * @param {boolean} DEBUG - enable verbose logging
 * @param {object} CONNECTION - connection to the RethinkDB database
 * @param {object} req - Express request
 * @param {object} res - Express response
 * @param {object} dat - JSON data of the request
 */
module.exports = (DEBUG, CONNECTION, req, res, dat) => {
  var newUpdate = {};
  if(typeof dat.accessor != 'string') {
    res.send({err: 'No accessor specified.'});
    return;
  }
  var tv = typeof dat.value;
  if(tv == 'undefined' || tv == 'null') {
    res.send({err: 'No value specified.'});
    return;
  }
  if(typeof dat.id == 'string') {
    newUpdate.id = dat.id;
    return;
  }
  newUpdate.accessor = dat.accessor;
  newUpdate.value = dat.value;
  //idsAndAccessors.push({id:dat.id,accessor:dat.accessor});
  //var idsExpr = r.expr(idsAndAccessors);
  if(newUpdate.id) {
    r.branch(
      r.table('Collectors')
        .getAll(newUpdate.accessor, {index:'accessor'})
          .filter({aggregate:true})
            .limit(1)
              .count()
                .eq(1),
      r.table('Collectors')
        .get(newUpdate.id)
          .update({value:newUpdate.value},{return_changes:'always'}),
      {replaced:0}
    ).run(CONNECTION, updated)
    /*r.table('Collectors')
      .getAll(newUpdate.accessor,{index:"accessor"})
        .filter({aggregate:true})
          .count()
            .run(CONNECTION, (err, count) => {
              if(DEBUG)console.log(count);
              if(count) {
                updateDocument();
              }
    })*/
  } else {
    r.table('Collectors')
      .getAll(newUpdate.accessor,{index:"accessor"})
        .update({value:newUpdate.value},{return_changes:'always'})
          .run(CONNECTION, updated)
          /*r.table('Collectors')
            .getAll(newUpdate.accessor,{index:"accessor"})
              .map({changes:[{new_val:r.row()}]})*/
  }
  function updated(err, updated) {
    if(DEBUG)console.log( err || updated)
    if(updated && typeof updated.changes[0].new_val == 'object') {
      var nv = updated.changes[0].new_val;
      r.table('Distributors')
      	.without('name')
          .merge(doc=>{
            return {
              collators:
                r.table('Collators')
                  .getAll(r.args(doc('collators')))
                    .pluck('id','filters')
                      .merge(doc=>{
                        return {
                          filters:
                            r.table('Filters')
                              .getAll(r.args(doc('filters')))
                                .pluck("id","json","code")
                                  .coerceTo('array')
                        }
                      }).coerceTo('array')
              }
            }).coerceTo('array').run(CONNECTION, (err, rows) => {
              //if(DEBUG)console.log(err || rows)
              var filters = {};
              var dostributors = [];
              var distributedData = [];
              for(var distributor of rows)
                for(var collator of distributor.collators)
                  for(var filter of collator.filters)
                    if(!filters.hasOwnProperty(filter.id))filters[filter.id] = filter.json;
              if(DEBUG)console.log(filters);
              var pass = false;
              var keys = Object.keys(filters);
              for(k of keys)
                if(recur(filters[k], nv, 'ROOT')) {
                  filters[k] = true;
                }
              for(var distributor of rows)
                for(var collator of distributor.collators) {
                  var pass = false;
                  for(var filter of collator.filters)
                    if(filters[filter.id]) {
                      var data = JSON.parse(JSON.stringify(newUpdate));
                      if(distributor.accessor) {
                        data.accessor = distributor.accessor;
                      }
                      if(distributor.push && !distributor.queue)
                        data.id = r.uuid(data.id + " " + distributor.id);
                      data.distributor = distributor.id;
                      //dostributors.push({id:distributor.id,accessor:distributor.accessor})
                      distributedData.push(data);
                      if(distributor.callback && validUrl.isUri(distributor.url)) {
                        sendDataToCallback(data, distributor.url);
                      } else if(distributor.push) {

                        r.table('DistributedData').insert(distributedData).run(CONNECTION, (err, inserted) => {
                          if(DEBUG)console.log(err || inserted)
                        })
                      }
                      pass = true;
                      break;
                    }
                  if(pass)break;
                }
              if(DEBUG)console.log("PASS");
              res.send({});
            })
    }
  }
  /*r.table('Collectors').filter(collector=>{
    //if(collector('accessor').eq())
  })*/
}
function sendDataToCallback(data, url) {
  if(!url.match(/^[A-Za-z]+:\/\//))url="http://"+url;
  request.post({
    headers: {'content-type': 'application/json'},
    url: url,
    body: data,
    json: true
  }, (err, res, bod) => {
    if(DEBUG)console.log("Called back");
    //if(DEBUG)console.log(err || res || body);
  })
}
function recur(root, update, gate) {
  //if(DEBUG)console.log(gate)
  var left, right, res = false;
  left = evaluateProperty(root, update, 0);
  right = evaluateProperty(root, update, 1);
  switch(gate) {
    case 'ROOT':
      res = !!left;
      break;
    case 'AND':
      res = left && right;
      break;
    case 'OR':
      res = left || right;
      break;
    case 'NAND':
      res = !(left && right);
      break;
    case 'NOR':
      res = !(left || right);
      break;
    case 'XOR':
      res = (left || right) && !(left && right);
      break;

    case 'UNDER':
      res = left < right;
      break;
    case 'OVER':
      res = left > right;
      break;
    case 'EQUALS':
      res = left == right;
      break;
    case 'TFEQUALS':
      res = left === right;
      break;
    case 'NEQUALS':
      res = left != right;
      break;
    case 'TFNEQUALS':
      res = left !== right;
      break;
    case 'OVEROR':
      res = left >= right;
      break;
    case 'UNDEROR':
      res = left <= right;
      break;
  }
  if(DEBUG)console.log(root, left, right, gate, res)
  return res;
}
function getProperty(object, key) {
  for(var k of key.substring(1).split('.')) {
      if(DEBUG)console.log(k, object[k])
      if(typeof object[k] != 'undefined' && typeof object[k] != 'null')object = object[k];
      else return null;
    }
    if(DEBUG)console.log('PROP', object)
    return object;
}
function evaluateProperty(object, update, child) {
  var keys = Object.keys(object);
  var key = keys[child];
  var side = object[key];
  switch(typeof side) {
    case 'object':
      side = recur(side, update, key);
      break;
    case 'string':
      if(side[0] === "$") side = getProperty(update, side);
      break;
  }
  return side;
}
