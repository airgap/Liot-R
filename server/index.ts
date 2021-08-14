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

import * as actions from './modules/actions/actions';

readConfig();

async function readConfig() {
	try {
		const text = await fs.readFile('liot-server-conf.json', 'utf8'),
			json = JSON.parse(text);
		if (json.port) CONFIG.port = json.port;
		console.log('config', json);
	} catch {}
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
	if (
		typeof action === 'string' &&
		action in actions &&
		(isLocal || actions[action].public)
	)
		res.send(await actions[action].perform(json, r));
}
