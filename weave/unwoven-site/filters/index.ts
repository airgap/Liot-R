import { LiotRClient } from '../liotRClient.js';
import { appendFilters } from '../script.js';
import { grab, load } from '../bonus.js';

const liotR = new LiotRClient();
var filterList;
var reg = location.href.match(/after=(-?[0-9]+)/);
var after = reg ? parseInt(reg[1]) : 0;
load(() => {
	filterList = grab('filter-list');
	liotR.listFilters({ after: after, count: 30 }, res => {
		if (res.err) {
			alert(res.err);
		} else {
			console.log(res.filters);
			appendFilters(res.filters, filterList);
		}
	});
});
export function populate() {
	var filters = [];
	for (var i = 0; i < 100; i++)
		filters.push({
			name: 'OUTTHERM_' + i,
			device_info: {
				manufacture_date: 'UNKNOWN',
				manufacturer: 'AcuRite',
				model: 'UNKNOWN',
				series: 'UNKNOWN'
			}
		});
	liotR.addFilters({ filters: filters }, res => {
		console.log(res.err || res);
	});
}
export const gotoStart = () => (location.href = '/filters?after=0');

export const gotoPrevious = () =>
	(location.href = '/filters?after=' + Math.max(0, after - 30));

export const gotoNext = () =>
	(location.href = '/filters?after=' + Math.max(0, after + 30));

export const gotoLast = () => (location.href = '/filters?after=-30');
