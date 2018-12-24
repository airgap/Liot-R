
var COMPARATORS = [
  "EQUALS",
  "NEQUALS",
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
  "list collectors": actionListCollectors,
  "add collectors": actionAddCollectors,
  "list filters": actionListFilters,
  "add filters": actionAddFilters,
  "list collators": actionListCollators,
  "add collators": actionAddCollators,
  "list distributors": actionListDistributors,
  "add distributors": actionAddDistributors,
  "alter distributors": actionModDistributors
}

var PUBLICACTIONS = {
}


readConfig();

function readConfig() {
  fs.readFile('liot-server-conf.json', (err, buffer) => {
    if(buffer) {
      var json = JSON.parse(buffer.toString());
      if(json.port)CONFIG.port = json.port;
      console.log(json);
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
      console.log("Cannot connect to RethinkDB");
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
      			console.log('Could not ensure existence of database for Liot R.');
      			return false;
      		} else {
      			CONNECTION = conn;
            conn.use('LiotR');
            if(status.dbs_created)
              console.log("Created database for Liot R.")
            else
              console.log("Found database for Liot R.")
      			console.log('Connected to database for Liot R.');
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
  console.log(isLocal)
  console.log(req.body);
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
                  console.log(err);
                } else {
                  res.send({collators:collators});
                  console.log('Queried collators.');
                  console.log(collators);
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
                  console.log(err);
                } else {
                  res.send({collectors:collectors});
                  console.log('Queried collectors.');
                  console.log(collectors);
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
                  console.log(err);
                } else {
                  res.send({filters:collators});
                  console.log('Queried filters.');
                  console.log(collators);
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
          .slice(after, after + count)
            .coerceTo('array')
              .run(CONNECTION, (err, distributors) => {
                if(err) {
                  res.send({err: 'Unable to query.'});
                  console.log(err);
                } else {
                  res.send({distributors:distributors});
                  console.log('Queried distributors.');
                  console.log(distributors);
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
        trec.smart = sortify(collector.name);
        collectors.push(trec);
      }
    }
    r.table('Collectors').insert(collectors).run(CONNECTION, (err, inserted) => {
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
  r.table('Collators').insert(collators).run(CONNECTION, (err, inserted) => {
    if(err) {
      res.send({err:"Unable to create collators."});
        console.log(err);
    } else {
      res.send({});
      console.log("Created collators.");
    }
  })
}

function actionAddDistributors(req, res, dat) {
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
    r.table('Distributors').insert(distributors).run(CONNECTION, (err, created) => {
      if(err) {
        res.send({err:'Error creating distributors.'});
        console.log(err);
      } else {
        res.send({});
        console.log('Created distributors.');
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
        console.log(json)
        recur(json);
        function recur(tree, current) {
        //console.log(tree, current);
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
            console.log(top && keys.length != 1)
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
            console.log('array: ' + current);
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
    r.table('Filters').insert(distributors).run(CONNECTION, (err, created) => {
      if(err) {
        res.send({err:'Error creating filters.'});
        console.log(err);
      } else {
        res.send({});
        console.log('Created filters.');
      }
    })
  }
  function err(text) { res.send({err: text}); console.log(text) }
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
        console.log(err);
      } else {
        res.send({});
        console.log('Updated distributors.');
      }
    })
  }
}
