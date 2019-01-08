var DEBUG = 1||false;

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


var r = require('rethinkdb');
var express = require('express');
var bodyParser = require('body-parser');
var validUrl = require('valid-url')
var request = require('request');
const app = express();
var fs = require('fs');
var CONFIG = {};
CONFIG.port = 7474;

app.use(bodyParser.json());

app.use((req, res, next) => {

	res.header('Access-Control-Allow-Origin','*')
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
})


var kRETURN_CHANGES = {return_changes: true};

var ADMINACTIONS = {
  /*Collectors*/
  "list collectors": actionListCollectors,
  "add collectors": actionAddCollectors,
  "get collectors": actionGetCollectors,
  "delete collectors": actionDeleteCollectors,
  //"get referenced collectors": actionGetReferencedCollectors,
  /*Filters*/
  "list filters": actionListFilters,
  "add filters": actionAddFilters,
  "get filters": actionGetFilters,
  "delete filters": actionDeleteFilters,
  "count filter references": actionCountFilterReferences,
  "list filter referrers": actionListFilterReferrers,
  /*Collators*/
  "list collators": actionListCollators,
  "add collators": actionAddCollators,
  "get collators": actionGetCollators,
  "delete collators": actionDeleteCollators,
  "count collator references": actionCountCollatorReferences,
  /*Distributors*/
  "list distributors": actionListDistributors,
  "add distributors": actionAddDistributors,
  "get distributors": actionGetDistributors,
  "delete distributors": actionDeleteDistributors,
  "alter distributors": actionModDistributors,
  /*Misc*/
  "push update": actionPushUpdate
}

var PUBLICACTIONS = {
}


readConfig();

function readConfig() {
  fs.readFile('liot-server-conf.json', (err, buffer) => {
    if(buffer) {
      var json = JSON.parse(buffer.toString());
      if(json.port)CONFIG.port = json.port;
      if(DEBUG)console.log(json);
      startRethinkServer();
      launchHttpServer();
    } else {
      startRethinkServer();
      launchHttpServer();
    }
  })
}

function startRethinkServer() {/* 1.db.yup.place => localhost */
	r.connect({host:'localhost'},(err, conn)=>{
    if(err || !conn) {
      if(DEBUG)console.log("Cannot connect to RethinkDB");
    } else {
      r.dbList().contains('LiotR')
        .do(exists=>{
          return r.branch(
            exists,
            {dbs_created: 0},
            r.dbCreate('LiotR')
          );
        }).run(conn, (err, status) => {
      		if(err || !conn) {
      			if(DEBUG)console.log('Could not ensure existence of database for Liot R.');
      			return false;
      		} else {
      			CONNECTION = conn;
            conn.use('LiotR');
            if(status.dbs_created)
              if(DEBUG)console.log("Created database for Liot R.")
            else
              if(DEBUG)console.log("Found database for Liot R.")
      			if(DEBUG)console.log('Connected to database for Liot R.');
      			return true;
      		}
        })
    }
	})
	//r.db('Yup');
}

function launchHttpServer() {
  app.post('/', rcvdPost)

  app.listen(CONFIG.port)
}

function rcvdPost(req, res) {
  var address = req.connection.remoteAddress;
  var isLocal = address.match(/^(127.0.0.1|::ffff:127.0.0.1|::1)$/)&&true;
  if(DEBUG)console.log(isLocal)
  if(DEBUG)console.log(req.body);
  var json = req.body;
  var action = json.action
	res.header('Access-Control-Allow-Origin','*')
  if(action) {
    var dat = req.body;
    if(isLocal && action in ADMINACTIONS) {
      ADMINACTIONS[action](req, res, dat);
    } else if(action in PUBLICACTIONS) {
      PUBLICACTIONS[action](req, res, dat);
    }

  }
}

function actionListCollators(req, res, dat) {
  var after = 0,
  count = 100,
  orders = ['smart','name', 'id'],
  order = 'smart',
  directions = ['ascending', 'descending'],
  direction = 'ascending';
  if(typeof dat.after == 'number') {
    after = dat.after;
  }
  if(typeof dat.count == 'number' && dat.count >= 0 && dat.count < 1001) {
    count = dat.count;
  }
  if(typeof dat.order === 'string' && dat.order in orders) {
    order = orders[dat.order];
  }
  if(typeof dat.direction === 'string' && dat.direction in directions) {
    direction = dat.direction;
  }
  if(direction == 'descending') order = r.desc(order)
  //var col = new Intl.Collator(undefined, {numeric: true, sensitivity: 'base'});
  var reg = /([A-Za-z]+|[0-9]+|.+?)/g;
  r.table('Collators').count().run(CONNECTION, (err, total) => {
    if(err) {

    } else {
      if(after<0)after += total;
      after = Math.max(0,after);
      var query = r.table('Collators')
        .orderBy(order)
          .slice(after, after + count).merge(doc=>{return {filtrets:r.table('Filters').getAll(r.args(doc('filters'))).coerceTo('array')}})
            .coerceTo('array')
              .run(CONNECTION, (err, collators) => {
                if(err) {
                  res.send({err: 'Unable to query.'});
                  if(DEBUG)console.log(err);
                } else {
                  res.send({collators:collators});
                  if(DEBUG)console.log('Queried collators.');
                  if(DEBUG)console.log(collators);
                }
              })
    }

  })


}

function actionListCollectors(req, res, dat) {
  var after = 0,
  count = 100,
  orders = ['smart','name', 'id'],
  order = 'smart',
  directions = ['ascending', 'descending'],
  direction = 'ascending';
  if(typeof dat.after == 'number') {
    after = dat.after;
  }
  if(typeof dat.count == 'number' && dat.count >= 0 && dat.count < 1001) {
    count = dat.count;
  }
  if(typeof dat.order === 'string' && dat.order in orders) {
    order = orders[dat.order];
  }
  if(typeof dat.direction === 'string' && dat.direction in directions) {
    direction = dat.direction;
  }
  if(direction == 'descending') order = r.desc(order)
  //var col = new Intl.Collator(undefined, {numeric: true, sensitivity: 'base'});
  var reg = /([A-Za-z]+|[0-9]+|.+?)/g;
  r.table('Collectors').count().run(CONNECTION, (err, total) => {
    if(err) {

    } else {
      if(after<0)after += total;
      after = Math.max(0,after);
      var query = r.table('Collectors')
        .orderBy(order)
          .slice(after, after + count)
            .coerceTo('array')
              .run(CONNECTION, (err, collectors) => {
                if(err) {
                  res.send({err: 'Unable to query.'});
                  if(DEBUG)console.log(err);
                } else {
                  res.send({collectors:collectors});
                  if(DEBUG)console.log('Queried collectors.');
                  if(DEBUG)console.log(collectors);
                }
              })
    }

  })


}

function actionListFilters(req, res, dat) {
  var after = 0,
  count = 100,
  orders = ['smart','name', 'id'],
  order = 'smart',
  directions = ['ascending', 'descending'],
  direction = 'ascending';
  if(typeof dat.after == 'number') {
    after = dat.after;
  }
  if(typeof dat.count == 'number' && dat.count >= 0 && dat.count < 1001) {
    count = dat.count;
  }
  if(typeof dat.order === 'string' && dat.order in orders) {
    order = orders[dat.order];
  }
  if(typeof dat.direction === 'string' && dat.direction in directions) {
    direction = dat.direction;
  }
  if(direction == 'descending') order = r.desc(order)
  //var col = new Intl.Collator(undefined, {numeric: true, sensitivity: 'base'});
  var reg = /([A-Za-z]+|[0-9]+|.+?)/g;
  r.table('Filters').count().run(CONNECTION, (err, total) => {
    if(err) {

    } else {
      if(after<0)after += total;
      after = Math.max(0,after);
      var query = r.table('Filters')
        .orderBy(order)
          .slice(after, after + count)
            .coerceTo('array')
              .run(CONNECTION, (err, collators) => {
                if(err) {
                  res.send({err: 'Unable to query.'});
                  if(DEBUG)console.log(err);
                } else {
                  res.send({filters:collators});
                  if(DEBUG)console.log('Queried filters.');
                  if(DEBUG)console.log(collators);
                }
              })
    }

  })


}

function actionListDistributors(req, res, dat) {
  var after = 0,
  count = 100,
  orders = ['smart','name', 'id'],
  order = 'smart',
  directions = ['ascending', 'descending'],
  direction = 'ascending';
  if(typeof dat.after == 'number') {
    after = dat.after;
  }
  if(typeof dat.count == 'number' && dat.count >= 0 && dat.count < 1001) {
    count = dat.count;
  }
  if(typeof dat.order === 'string' && dat.order in orders) {
    order = orders[dat.order];
  }
  if(typeof dat.direction === 'string' && dat.direction in directions) {
    direction = dat.direction;
  }
  if(direction == 'descending') order = r.desc(order)
  //var col = new Intl.Collator(undefined, {numeric: true, sensitivity: 'base'});
  var reg = /([A-Za-z]+|[0-9]+|.+?)/g;
  r.table('Distributors').count().run(CONNECTION, (err, total) => {
    if(err) {

    } else {
      if(after<0)after += total;
      after = Math.max(0,after);
      var query = r.table('Distributors')
        .orderBy(order)
          .slice(after, after + count).merge(doc=>{return {collets:r.table('Collators').getAll(r.args(doc('collators')))
.merge(doc=>{return {filtrets:r.table('Filters').getAll(r.args(doc('filters'))).coerceTo('array')}})
          .coerceTo('array')}})
            .coerceTo('array')
              .run(CONNECTION, (err, distributors) => {
                if(err) {
                  res.send({err: 'Unable to query.'});
                  if(DEBUG)console.log(err);
                } else {
                  res.send({distributors:distributors});
                  if(DEBUG)console.log('Queried distributors.');
                  if(DEBUG)console.log(distributors);
                }
              })
    }

  })


}

function actionAddCollectors(req, res, dat) {
  var collectors = [];
  var manufacturer_attributes = ['manufacture_date', 'manufacturer', 'model', 'series'];
  if(Array.isArray(dat.collectors)) {
    for(var collector of dat.collectors) {
      if(typeof collector === 'object') {
        var trec = {};
        if(typeof collector.device_info === 'object') {
          var device_info = collector.device_info;
          trec.device_info = {};
          for(var manufacturer_attribute of manufacturer_attributes)
            if(typeof device_info[manufacturer_attribute] === 'string' && device_info[manufacturer_attribute].length < 100)
              trec.device_info[manufacturer_attribute] = device_info[manufacturer_attribute];
        }
        if(typeof collector.name === 'string' && collector.name.length < 100)
          trec.name = collector.name;
        trec.value = 0;
        trec.smart = sortify(collector.name || "");
        trec.aggregate = !!collector.aggregate
        trec.accessor = r.uuid();//rename collators to funnels?
        //trec.funnel = r.uuid();//rename collators to funnels?
        collectors.push(trec);
      }
    }
    r.table('Collectors').insert(collectors, { conflict: 'replace' }).run(CONNECTION, (err, inserted) => {
      var obj = err ? {err: 'Could not create collectors.'} : {}
      res.send(obj)
    });
  }
}


function sortify(text) {
  var reg = /([A-Za-z]+|[0-9]+|.+?)/g;
  var score = 0;
  var regontxt = text.match(reg);
  if(regontxt) {
    for(var i = 0; i < regontxt.length; i ++) {
      var match = regontxt[i]
      if(match.match(/^[A-Za-z]+$/)) {
        for(var l in match)score += match.charCodeAt(l);
      } else if(match.match(/^[0-9]+$/)) {
        score += match*1;
      } else {
        for(var l in match)score += match.charCodeAt(l);
      }
    }
  }
  return score
}

function actionAddCollators(req, res, dat) {
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

function actionAddDistributors(req, res, dat) {
  if(Array.isArray(dat.distributors)) {
    var distributors = [];
    for(var distributor of dat.distributors) {
      var trans = {collators:[]}
      if(typeof distributor.id === "string") {
        trans.id = distributor.id;
      }
      if(Array.isArray(distributor.collators)) {
        for(var collator of distributor.collators) {
          trans.collators.push(collator);
        }
      }
      if(typeof distributor.url === 'string' && validUrl.isUri(distributor.url)) {
        trans.url = distributor.url;
      }
      if(typeof distributor.name === 'string' && distributor.name.length > 0) {
        trans.name = distributor.name;
      }
      trans.push = !!distributor.push;
      trans.queue = !!distributor.queue;
      trans.callback = !!distributor.callback;
      distributors.push(trans);
    }
    r.table('Distributors').insert(distributors, { conflict: 'replace' }).run(CONNECTION, (err, created) => {
      if(err) {
        res.send({err:'Error creating distributors.'});
        if(DEBUG)console.log(err);
      } else {
        res.send({});
        if(DEBUG)console.log('Created distributors.');
      }
    })
  }
}

function actionAddFilters(req, res, dat) {
  if(Array.isArray(dat.filters)) {
    var distributors = [];
    for(var distributor of dat.filters) {
      var trans = {};
      if(typeof distributor.name === "string") {
        trans.name = distributor.name;
      }
      if(typeof distributor.id === "string") {
        trans.id = distributor.id;
      }
      if(typeof distributor.code === "string") {
        var code = distributor.code;
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
        trans.code = distributor.code;
        trans.json = json;
      }
      distributors.push(trans);
    }
    r.table('Filters').insert(distributors, { conflict: 'replace' }).run(CONNECTION, (err, created) => {
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

function actionModDistributors(req, res, dat) {
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

/*
function actionPushUpdates(req, res, dat) {
  if(!Array.isArray(dat.updates)) {
    res.send({err: 'No updates specified.'});
    return;
  }
  var toPush = [];
  var idsAndAccessors = [];
  var ids = [];

  for(var update of dat.updates) {
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
    newUpdate.accessor = dat.accessor;
    newUpdate.value = dat.value;
    idsAndAccessors.push({id:dat.id,accessor:dat.accessor});
  }
  var idsExpr = r.expr(idsAndAccessors);
  r.table('Collectors').filter(collector=>{
    //if(collector('accessor').eq())
  })
}
*/

function actionPushUpdate(req, res, dat) {
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

function actionGetFilters(req, res, dat) {
  if(!Array.isArray(dat.ids)) {
    res.send({err: "No list of IDs provided."});
    return;
  }
  for(var id of dat.ids)if(typeof id != 'string' || id.length > 55) { res.send({err: 'Invalid (non-string) ID provided.'}); return }
  var query = r.table('Filters')
    .filter(doc=>{return r.expr(dat.ids).contains(doc('id'))})
        .coerceTo('array')
          .run(CONNECTION, (err, collators) => {
            if(err) {
              res.send({err: 'Unable to query.'});
              if(DEBUG)console.log(err);
            } else {
              res.send({filters:collators});
              if(DEBUG)console.log('Queried filters.');
              if(DEBUG)console.log(collators);
            }
          })


}

function actionDeleteFilters(req, res, dat) {
  if(!Array.isArray(dat.ids)) {
    res.send({err: "No list of IDs provided."});
    return;
  }
  for(var id of dat.ids)if(typeof id != 'string' || id.length > 55) { res.send({err: 'Invalid (non-string) ID provided.'}); return }
  var query = r.table('Filters')
    .filter(doc=>{return r.expr(dat.ids).contains(doc('id'))})
      .delete()
        .run(CONNECTION, (err, collators) => {
          if(err) {
            res.send({err: 'Unable to query.'});
            if(DEBUG)console.log(err);
          } else {
            res.send({filters:collators});
            if(DEBUG)console.log('Queried filters.');
            if(DEBUG)console.log(collators);
          }
        })


}

function actionGetCollators(req, res, dat) {
  if(!Array.isArray(dat.ids)) {
    res.send({err: "No list of IDs provided."});
    return;
  }
  for(var id of dat.ids)if(typeof id != 'string' || id.length > 55) { res.send({err: 'Invalid (non-string) ID provided.'}); return }
  var query = r.table('Collators')
    .filter(doc=>{return r.expr(dat.ids).contains(doc('id'))})
      .merge(doc=>{return {filtrets:r.table('Filters').getAll(r.args(doc('filters'))).coerceTo('array')}})
        .coerceTo('array')
          .run(CONNECTION, (err, collators) => {
            if(err) {
              res.send({err: 'Unable to query.'});
              if(DEBUG)console.log(err);
            } else {
              res.send({collators:collators});
              if(DEBUG)console.log('Queried collators.');
              if(DEBUG)console.log(collators);
            }
          })


}

function actionDeleteCollators(req, res, dat) {
  if(!Array.isArray(dat.ids)) {
    res.send({err: "No list of IDs provided."});
    return;
  }
  for(var id of dat.ids)if(typeof id != 'string' || id.length > 55) { res.send({err: 'Invalid (non-string) ID provided.'}); return }
  var query = r.table('Collators')
    .filter(doc=>{return r.expr(dat.ids).contains(doc('id'))})
      .delete()
        .run(CONNECTION, (err, collators) => {
          if(err) {
            res.send({err: 'Unable to query.'});
            if(DEBUG)console.log(err);
          } else {
            //res.send({filters:collators});
            if(DEBUG)console.log('Queried collators.');
            if(DEBUG)console.log(collators);
          }
        })


}

function actionGetDistributors(req, res, dat) {
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

function actionDeleteDistributors(req, res, dat) {
  if(!Array.isArray(dat.ids)) {
    res.send({err: "No list of IDs provided."});
    return;
  }
  for(var id of dat.ids)if(typeof id != 'string' || id.length > 55) { res.send({err: 'Invalid (non-string) ID provided.'}); return }
  var query = r.table('Distributors')
    .filter(doc=>{return r.expr(dat.ids).contains(doc('id'))})
      .delete()
        .run(CONNECTION, (err, collators) => {
          if(err) {
            res.send({err: 'Unable to query.'});
            if(DEBUG)console.log(err);
          } else {
            //res.send({filters:collators});
            if(DEBUG)console.log('Queried distributors.');
            if(DEBUG)console.log(collators);
          }
        })


}

function actionGetCollectors(req, res, dat) {
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

function actionDeleteCollectors(req, res, dat) {
  if(!Array.isArray(dat.ids)) {
    res.send({err: "No list of IDs provided."});
    return;
  }
  for(var id of dat.ids)if(typeof id != 'string' || id.length > 55) { res.send({err: 'Invalid (non-string) ID provided.'}); return }
  var query = r.table('Collectors')
    .filter(doc=>{return r.expr(dat.ids).contains(doc('id'))})
      .delete()
        .run(CONNECTION, (err, collators) => {
          if(err) {
            res.send({err: 'Unable to query.'});
            if(DEBUG)console.log(err);
          } else {
            //res.send({filters:collators});
            if(DEBUG)console.log('Queried collectors.');
            if(DEBUG)console.log(collators);
          }
        })


}

function actionCountFilterReferences(req, res, dat) {
  query = buildFilterReferenceCounterQuery(Array.isArray(dat.ids) ? dat.ids : null);
  query.coerceTo('array').run(CONNECTION, (err, filters) => {
    if(err) {
      res.send('Error counting filter references.');
      return;
    }
    res.send({filters:filters});
  })
}

function buildFilterReferenceCounterQuery(ids, callback) {
  //referenced = !!referenced;
  var query = r.table('Filters');
  if(Array.isArray(ids))
    query = query.filter(d=>{return r.expr(ids).contains(d('id'))});
  //var isReferencedFilter = //r.table("Collators").group('id')('filters')(0).contains(f('id')).ungroup().contains(true);
  //For counting
  //('reduction').filter(r=>{return r.eq(true)}).count()
  //if(!referenced)isReferencedFilter = isReferencedFilter.not();
  query = query.map(filt=>{return {id:filt('id'),refcount:r.table("Collators").group('id')('filters')(0).contains(filt('id')).ungroup()('reduction').filter(r=>{return r.eq(true)}).count()}})
  //query = query.filter(isReferencedFilter);
  return query;
}

function actionCountCollatorReferences(req, res, dat) {
  query = buildCollatorReferenceCounterQuery(Array.isArray(dat.ids) ? dat.ids : null);
  query.coerceTo('array').run(CONNECTION, (err, collators) => {
    if(err) {
      res.send('Error counting collator references.');
      return;
    }
    res.send({collators:collators});
  })
}

function buildCollatorReferenceCounterQuery(ids, callback) {
  var query = r.table('Collators');
  if(Array.isArray(ids))
    query = query.filter(d=>{
      return r.expr(ids).contains(d('id'))
    });
  query = query.map(filt=>{
    return {
      id:filt('id'),
      refcount:r.table("Distributors")
        .group('id')('collators')(0)
          .contains(filt('id'))
            .ungroup()('reduction')
              .filter(r=>{
                return r.eq(true)
              }).count()
    }
  })
  return query;
}

function actionListFilterReferrers(req, res, dat) {
  var query = buildFilterReferrerListerQuery(Array.isArray(dat.ids) ? dat.ids : null);
  query.coerceTo('array').run(CONNECTION, (err, filters) => {
    if(err) {
      res.send('Error listing filter referrers.');
      return;
    }
    res.send({filters:filters});
  })
}

function buildFilterReferrerListerQuery(ids, callback) {
  var query = r.table('Filters');
  if(Array.isArray(ids))
    query = query.filter(d=>{return r.expr(ids).contains(d('id'))});
  query = query.map(filt=>{
    return {
      id:filt('id'),
      referrers:r.db('LiotR')
        .table("Collators")
            .filter(col=>{
              return col('filters')
                .contains(filt('id'))
              }).merge(doc=>{return {filtrets:r.table('Filters').getAll(r.args(doc('filters'))).coerceTo('array')}})
              .coerceTo('array')
    }
  })
  return query;
}

function actionListFilterDistributors(req, res, dat) {
  var query = buildFilterReferrerListerQuery(Array.isArray(dat.ids) ? dat.ids : null);
  query.coerceTo('array').run(CONNECTION, (err, filters) => {
    if(err) {
      res.send('Error listing filter referrers.');
      return;
    }
    res.send({filters:filters});
  })
}

function buildFilterDistributorListerQuery(ids, callback) {
  var query = r.table('Filters');
  if(Array.isArray(ids))
    query = query.filter(d=>{return r.expr(ids).contains(d('id'))});
  query = query.map(filt=>{
    return {
      id:filt('id'),
      referrers:r.db('LiotR')
        .table("Collators")
            .filter(col=>{
              return col('filters')
                .contains(filt('id'))
              }).merge(doc=>{return {filtrets:r.table('Filters').getAll(r.args(doc('filters'))).coerceTo('array')}})
              .coerceTo('array')
    }
  })
  return query;
}
