var DEBUG = 1||false;
var TABLES = ['Filters', 'Collectors', 'Collators', 'Distributors', 'DistributedData']
var ENSURED_TABLES = [];

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


var actions = {
  collectors: {
    list: require('./modules/action-list-collectors'),
    add: require('./modules/action-add-collectors'),
    get: require('./modules/action-get-collectors'),
    delete: require('./modules/action-delete-collectors')
  },
  filters: {
    list: require('./modules/action-list-filters'),
    add: require('./modules/action-add-filters'),
    get: require('./modules/action-get-filters'),
    delete: require('./modules/action-delete-filters'),
    references: {
      count: require('./modules/action-count-filter-references')
    },
    referrers: {
      list: require('./modules/action-list-filter-referrers')
    }
  },
  collators: {
    list: require('./modules/action-list-collators'),
    add: require('./modules/action-add-collators'),
    get: require('./modules/action-get-collators'),
    delete: require('./modules/action-delete-collators'),
    references: {
      count: require('./modules/action-count-collator-references')
    }
  },
  distributors: {
    list: require('./modules/action-list-distributors'),
    add: require('./modules/action-add-distributors'),
    get: require('./modules/action-get-distributors'),
    delete: require('./modules/action-delete-distributors')
  },
  updates: {
    push: require('./modules/action-push-update')
  }
}

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
            for(var t of TABLES)
              ensureTable(t)
      			return true;
      		}
        })
    }
	})
	//r.db('Yup');
}

function ensureTable(t) {
  r.tableList().contains(t).do(e=>{
    return r.branch(e,
      { dbs_created: 0},
      r.tableCreate(t)
    );
  }).run(CONNECTION, (err, status) => {
    if(status.dbs_created) console.log("Table " + t + " created.")
    ENSURED_TABLES.push(t)
    if(ENSURED_TABLES.length==TABLES.length) console.log('All tables ensured.');
  })
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
      ADMINACTIONS[action](DEBUG, CONNECTION, req, res, dat);
    } else if(action in PUBLICACTIONS) {
      PUBLICACTIONS[action](DEBUG, CONNECTION, req, res, dat);
    }

  }
}
