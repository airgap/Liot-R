import * as fs from 'fs/promises';
import { exists as existsCallback } from 'fs';
import { promisify } from 'util';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as dash from 'rethinkdbdash';

const exists = promisify(existsCallback);

const TABLES = [
	'Filters',
	'Collectors',
	'Collators',
	'Distributors',
	'DistributedData'
];
const ENSURED_TABLES = [];

let r;

const app = express();
const adminPanel = express();

const CONFIG: any = {};
CONFIG.port = 7474;

app.use(bodyParser.json());

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept'
	);
	next();
});

const actions = {
	collectors: {
		list: require('./modules/actions/action-list-collectors'),
		add: require('./modules/actions/action-add-collectors'),
		get: require('./modules/actions/action-get-collectors'),
		delete: require('./modules/actions/action-delete-collectors')
	},
	filters: {
		list: require('./modules/actions/action-list-filters'),
		add: require('./modules/actions/action-add-filters'),
		get: require('./modules/actions/action-get-filters'),
		delete: require('./modules/actions/action-delete-filters'),
		references: {
			count: require('./modules/actions/action-count-filter-references')
		},
		referrers: {
			list: require('./modules/actions/action-list-filter-referrers')
		}
	},
	collators: {
		list: require('./modules/actions/action-list-collators'),
		add: require('./modules/actions/action-add-collators'),
		get: require('./modules/actions/action-get-collators'),
		delete: require('./modules/actions/action-delete-collators'),
		references: {
			count: require('./modules/actions/action-count-collator-references')
		}
	},
	distributors: {
		list: require('./modules/actions/action-list-distributors'),
		add: require('./modules/actions/action-add-distributors'),
		get: require('./modules/actions/action-get-distributors'),
		delete: require('./modules/actions/action-delete-distributors')
	},
	updates: {
		push: require('./modules/actions/action-push-update')
	}
};

const adminActions = {
	/*Collectors*/
	'list collectors': actions.collectors.list,
	'add collectors': actions.collectors.add,
	'get collectors': actions.collectors.get,
	'delete collectors': actions.collectors.delete,
	//"get referenced collectors": actionGetReferencedCollectors,
	/*Filters*/
	'list filters': actions.filters.list,
	'add filters': actions.filters.add,
	'get filters': actions.filters.get,
	'delete filters': actions.filters.delete,
	'count filter references': actions.filters.references.count,
	'list filter referrers': actions.filters.referrers.list,
	/*Collators*/
	'list collators': actions.collators.list,
	'add collators': actions.collators.add,
	'get collators': actions.collators.get,
	'delete collators': actions.collators.delete,
	'count collator references': actions.collators.references.count,
	/*Distributors*/
	'list distributors': actions.distributors.list,
	'add distributors': actions.distributors.add,
	'get distributors': actions.distributors.get,
	'delete distributors': actions.distributors.delete,
	/*Misc*/
	'push update': actions.updates.push
};

const publicActions = {};

readConfig();

async function readConfig() {
	const text = await fs.readFile('liot-server-conf.json', 'utf8'),
		json = JSON.parse(text);
	if (json.port) CONFIG.port = json.port;
	console.log('config', json);
	await startRethinkServer();
	await launchHttpServer();
}

async function startRethinkServer() {
	r = dash({});
	await r
		.dbList()
		.contains('LiotR')
		.do(exists => {
			return r.branch(exists, { dbs_created: 0 }, r.dbCreate('LiotR'));
		});
	r = dash({ db: 'LiotR' });
	console.log('Connected to database for Liot R.');
	for (const t of TABLES) await ensureTable(t);
	return true;
}

async function ensureTable(t) {
	const status = await r
		.tableList()
		.contains(t)
		.do(e => r.branch(e, { dbs_created: 0 }, r.tableCreate(t)));
	if (status.dbs_created) console.log('Table ' + t + ' created.');
	ENSURED_TABLES.push(t);
	if (ENSURED_TABLES.length == TABLES.length)
		console.log('All tables ensured.');
}

async function launchHttpServer() {
	app.post('/', rcvdPost);
	console.log(`HTTP server launched on port ${CONFIG.port}.`);
	app.listen(CONFIG.port);
	if (await exists('./webui')) {
		adminPanel.listen(80);
		adminPanel.use(express.static('./webui'));
		console.log(`Admin panel launched on port ${80}.`);
	} else console.log('No admin panel detected. Running in headless mode.');
}

async function rcvdPost(req, res) {
	const address = req.connection.remoteAddress,
		isLocal = address.match(/^(127.0.0.1|::ffff:127.0.0.1|::1)$/) && true,
		json = req.body,
		{ action } = json;
	res.header('Access-Control-Allow-Origin', '*');
	if (!action) return;
	if (isLocal && action in adminActions)
		res.send(adminActions[action](json, r));
	else if (action in publicActions) res.send(publicActions[action](json, r));
}
