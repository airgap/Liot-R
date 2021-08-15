import { addc, grab, load } from '../bonus.js';
import { LiotR } from '../liotr.js';
import {
	appendCollators,
	appendDropper,
	appendPlaceholder,
	appendSpecifics,
	namify
} from '../script';

var distributorList;
var reg = location.href.match(/after=(-?[0-9]+)/);
var after = reg ? parseInt(reg[1]) : 0;
const liotR = new LiotR();
load(() => {
	distributorList = grab('distributor-list');
	liotR.listDistributors({ after: after, count: 30 }, res => {
		if (res.err) {
			alert(res.err);
		} else {
			console.log(res.distributors);
			appendDistributors(res.distributors);
		}
	});
});
function appendDistributors(distributors) {
	for (var i = 0; i < distributors.length; i++) {
		var rec = distributors[i];
		var bubble = nelem('div');
		addc(bubble, 'bubble');
		var top = nelem('div');
		addc(top, 'bubble-top');
		bubble.appendChild(top);
		var nameBox = nelem('label');
		nameBox.innerHTML = namify(rec, 'distributor'); //xss((rec.name || rec.id) + "");
		var idBox = nelem('label');
		idBox.innerHTML = xss(rec.id);

		var valBox = nelem('label');
		//addc(valBox, 'filters-tooltip');
		var filternames = '';
		for (var filtret of rec.collets)
			filternames +=
				(filtret.name || '[' + filtret.id.substring(0, 9) + ']') + ', ';
		filternames =
			'(' + filternames.substring(0, filternames.length - 2) + ')';
		valBox.innerHTML = xss(filternames);
		top.appendChild(nameBox);
		//top.appendChild(valBox);
		//bubble.appendChild(idBox);
		appendCollators(rec.collets, bubble);
		appendDropper(bubble);
		distributorList.appendChild(bubble);
		appendSpecifics(bubble, rec.id, 'distributor');
		//bindBubble(bubble,rec)
	}
	if (!distributors.length) appendPlaceholder('filters', distributorList);
}
function populate() {
	var distributors = [];
	for (var i = 0; i < 100; i++)
		distributors.push({
			name: 'OUTTHERM_' + i,
			device_info: {
				manufacture_date: 'UNKNOWN',
				manufacturer: 'AcuRite',
				model: 'UNKNOWN',
				series: 'UNKNOWN'
			}
		});
	liotR.addDistributors({ distributors: distributors }, res => {
		console.log(res.err || res);
	});
}
function gotoStart() {
	location.href = '/distributors?after=0';
}
function gotoPrevious() {
	location.href = '/distributors?after=' + Math.max(0, after - 30);
}
function gotoNext() {
	location.href = '/distributors?after=' + Math.max(0, after + 30);
}
function gotoLast() {
	location.href = '/distributors?after=-30';
}
function xss(text) {
	return text.replace('<', '&lt');
}
function nelem(type) {
	return document.createElement(type);
}
