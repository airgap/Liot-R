
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
CONFIG.port = 7475;
var sinceLast = 0;
var counterval = setInterval(counter, 1000);

function counter() {
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  process.stdout.write("QPS: "+sinceLast)
  sinceLast = 0;
}

app.use(bodyParser.json());

app.use((req, res, next) => {

	res.header('Access-Control-Allow-Origin','*')
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
})


var kRETURN_CHANGES = {return_changes: true};

var ADMINACTIONS = {
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
  //console.log(isLocal)
  //console.log(req.body);
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
  sinceLast++;
  //console.log(req)
}
