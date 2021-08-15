import { LiotR } from '../liotr';
import { appendCollectors } from '../script';
import { grab, load } from '../bonus';

var collectorList;
var reg = location.href.match(/after=(-?[0-9]+)/);
var after = reg ? parseInt(reg[1]) : 0;
const liotR = new LiotR();
load(() => {
	collectorList = grab('collector-list');
	liotR.listCollectors({ after: after, count: 30 }, res => {
		if (res.err) {
			alert(res.err);
		} else {
			console.log(res.collectors);
			appendCollectors(res.collectors, collectorList);
		}
	});
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
function populate() {
	var collectors = [];
	for (var i = 0; i < 100; i++)
		collectors.push({
			name: 'OUTTHERM_' + i,
			device_info: {
				manufacture_date: 'UNKNOWN',
				manufacturer: 'AcuRite',
				model: 'UNKNOWN',
				series: 'UNKNOWN'
			}
		});
	liotR.addCollectors({ collectors: collectors }, res => {
		console.log(res.err || res);
	});
}
function gotoStart() {
	location.href = '/collectors?after=0';
}
function gotoPrevious() {
	location.href = '/collectors?after=' + Math.max(0, after - 30);
}
function gotoNext() {
	location.href = '/collectors?after=' + Math.max(0, after + 30);
}
function gotoLast() {
	location.href = '/collectors?after=-30';
}
function xss(text) {
	return text.replace('<', '&lt');
}
function nelem(type) {
	return document.createElement(type);
}
