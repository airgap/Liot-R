import { grab, load } from '../bonus.js';
import { LiotR } from '../liotr.js';
import { appendCollators } from '../script';

var collatorList;
var reg = location.href.match(/after=(-?[0-9]+)/);
var after = reg ? parseInt(reg[1]) : 0;
const liotR = new LiotR();
load(() => {
	collatorList = grab('collator-list');
	liotR.listCollators({ after: after, count: 30 }, res => {
		if (res.err) {
			alert(res.err);
		} else {
			console.log(res.collators);
			appendCollators(res.collators, collatorList);
		}
	});
});
function populate() {
	var collators = [];
	for (var i = 0; i < 100; i++)
		collators.push({
			name: 'OUTTHERM_' + i,
			device_info: {
				manufacture_date: 'UNKNOWN',
				manufacturer: 'AcuRite',
				model: 'UNKNOWN',
				series: 'UNKNOWN'
			}
		});
	liotR.addCollators({ collators: collators }, res => {
		console.log(res.err || res);
	});
}
function gotoStart() {
	location.href = '/collators?after=0';
}
function gotoPrevious() {
	location.href = '/collators?after=' + Math.max(0, after - 30);
}
function gotoNext() {
	location.href = '/collators?after=' + Math.max(0, after + 30);
}
function gotoLast() {
	location.href = '/collators?after=-30';
}
