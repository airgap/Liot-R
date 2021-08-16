import { Client } from '../Client.js';
import { appendCollectors } from '../script.js';
import { grab, load } from '../bonus.js';
import { Collector } from '../../../types/Collector';
import { Anonymous } from '../../../types/Anonymous';

var collectorList;
var reg = location.href.match(/after=(-?[0-9]+)/);
var after = reg ? parseInt(reg[1]) : 0;
const liotR = new Client();
load(async () => {
	collectorList = grab('collector-list');
	const collectors = await liotR.listCollectors({ after: after, count: 30 });
	appendCollectors(collectors, collectorList);
});
/*function appendCollectors(collectors) {
  for(var i = 0; i < collectors.length; i ++) {
	var rec = collectors[i];
	var bubble = nelem('div');
	addc(bubble, 'bubble');
	var nameBox = nelem('label');
	nameBox.innerHTML = xss((rec.name || rec.id) + ":");
	var idBox = nelem('label');
	idBox.innerHTML = xss(rec.id);

	var valBox = nelem('label');
	valBox.innerHTML = xss(stringValue(rec.value))
	bubble.appendChild(nameBox);
	bubble.appendChild(valBox);
	//bubble.appendChild(idBox);
	collectorList.appendChild(bubble);
	bindBubble(bubble,rec)
  }
}*/
export const populate = async () => {
	const collectors: Anonymous<Collector>[] = [];
	for (let i = 0; i < 100; i++)
		collectors.push({
			name: 'OUTTHERM_' + i,
			deviceInfo: {
				manufacturer: 'AcuRite',
				model: 'UNKNOWN',
				series: 'UNKNOWN'
			}
		});
	await liotR.addCollectors(collectors);
};
const gotoStart = () => (location.href = '/collectors?after=0');

const gotoPrevious = () =>
	(location.href = '/collectors?after=' + Math.max(0, after - 30));

const gotoNext = () =>
	(location.href = '/collectors?after=' + Math.max(0, after + 30));

const gotoLast = () => (location.href = '/collectors?after=-30');
