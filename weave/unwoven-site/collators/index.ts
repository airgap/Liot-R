import { grab, load } from '../bonus.js';
import { Client } from '../Client.js';
import { appendCollators } from '../script';

var collatorList;
var reg = location.href.match(/after=(-?[0-9]+)/);
var after = reg ? parseInt(reg[1]) : 0;
const liotR = new Client();
load(async () => {
	collatorList = grab('collator-list');
	const collators = await liotR.listCollators({ after: after, count: 30 });
	console.log(collators);
	appendCollators(collators, collatorList);
});
const populate = async () => {
	const collators = [];
	for (let i = 0; i < 100; i++)
		collators.push({
			name: 'OUTTHERM_' + i,
			deviceInfo: {
				manufacture_date: 'UNKNOWN',
				manufacturer: 'AcuRite',
				model: 'UNKNOWN',
				series: 'UNKNOWN'
			}
		});
	const res = await liotR.addCollators(collators);
	console.log(res);
};
const gotoStart = () => (location.href = '/collators?after=0');

const gotoPrevious = () =>
	(location.href = '/collators?after=' + Math.max(0, after - 30));

const gotoNext = () =>
	(location.href = '/collators?after=' + Math.max(0, after + 30));

const gotoLast = () => (location.href = '/collators?after=-30');
