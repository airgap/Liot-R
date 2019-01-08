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
var actions = {};

actions.collectors = {};
actions.collectors.list = require('./modules/action-list-collectors');
actions.collectors.add = require('./modules/action-add-collectors');
actions.collectors.get = require('./modules/action-get-collectors');
actions.collectors.delete = require('./modules/action-delete-collectors');
actions.filters = {};
actions.filters.list = require('./modules/action-list-filters');
actions.filters.add = require('./modules/action-add-filters');
actions.filters.get = require('./modules/action-get-filters');
actions.filters.delete = require('./modules/action-delete-filters');
actions.filters.references = {};
actions.filters.references.count = require('./modules/action-count-filter-references');
actions.filters.referrers.count = require('./modules/action-list-filter-referrers');
actions.collators = {};
actions.collators.list = require('./modules/action-list-collators');
actions.collators.add = require('./modules/action-add-collators');
actions.collators.get = require('./modules/action-get-collators');
actions.collators.delete = require('./modules/action-delete-collators');
actions.collators.references.count = require('./modules/action-count-collator-references');
actions.distributors = {};
actions.distributors.list = require('./modules/action-list-distributors');
actions.distributors.add = require('./modules/action-add-distributors');
actions.distributors.get = require('./modules/action-get-distributors');
actions.distributors.delete = require('./modules/action-delete-distributors');
actions.updates = {};
actions.updates.push = require('./modules/action-push-update');

var ADMINACTIONS = {
  /*Collectors*/
  "list collectors": actions.collectors.list,
  "add collectors": actions.collectors.add,
  "get collectors": actions.getCollectors,
  "delete collectors": actions.deleteCollectors,
  //"get referenced collectors": actionGetReferencedCollectors,
  /*Filters*/
  "list filters": actions.filters.list,
  "add filters": actions.filters.add,
  "get filters": actions.filters.get,
  "delete filters": actions.filters.delete,
  "count filter references": actions.filters.references.count,
  "list filter referrers": actions.filters.referrers.list,
  /*Collators*/
  "list collators": actions.collators.list,
  "add collators": actions.collators.add,
  "get collators": actions.collators.get,
  "delete collators": actions.collators.delete,
  "count collator references": actions.collators.references.count,
  /*Distributors*/
  "list distributors": actions.distributors.list,
  "add distributors": actions.distributors.add,
  "get distributors": actions.distributors.get,
  "delete distributors": actions.distributors.delete,
  /*Misc*/
  "push update": actions.updates.push
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
      ADMINACTIONS[action](CONNECTION, req, res, dat);
    } else if(action in PUBLICACTIONS) {
      PUBLICACTIONS[action](CONNECTION, req, res, dat);
    }

  }
}

//action list collators

/*action list collectors*/

//action list filters

//action list distributors

//action add collectors


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

//action add collators

//action add distributors

//action add filters

//action mod distributors

/*
//action push updates
*/

//action push update

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

//action get filters

//action delete filters

//action get collators

//action delete collators

//action get distributors

//action delete distributors

//action get collectors

//action delete collectors

//action count filter references

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

//action count collator references

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

//action list filter referrers

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

//action list filter distributors

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
