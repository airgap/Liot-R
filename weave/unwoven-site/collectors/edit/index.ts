import { LiotR } from '../../liotr.js';
import { grab, load, setc } from '../../bonus.js';
import { getPageId } from '../../script.js';

var ID = getPageId();
const liotR = new LiotR();
load(() => {
	liotR.getCollectors({ ids: [ID] }, res => {
		if (res.err) err('Error retreiving collector.');
		else if (!res.collectors.length) err('Invalid collector selected.');
		else {
			var c = res.collectors[0];
			if (typeof c.name === 'string')
				grab('collector-name').value = c.name;
			if (typeof c.device_info == 'object')
				for (var t of 'manufacturer model series'.split(' '))
					if (typeof c.device_info[t] === 'string')
						grab('collector-' + t).value = c.device_info[t];
		}
	});
});
function save() {
	//addc('save-button', 'disabled');
	err('Creating collector...');
	var collector = { name: grab('collector-name').value, device_info: {} };
	for (var t of 'manufacturer model series'.split(' ')) {
		collector.device_info[t] = grab('collector-' + t).value;
	}
	liotR.addCollectors(
		{
			collectors: [collector]
		},
		res => {
			if (res.err) {
				console.log(res.err);
				return;
			}
			location.href = '/collectors';
		}
	);
}
//Delete the filter
function deletec() {
	if (
		confirm(
			'Are you sure you wish to delete this collector? This action cannot be undone.'
		)
	) {
		liotR.deleteCollectors({ ids: [ID] }, res => {
			location.href = 'collectors';
		});
	}
}
function err(text) {
	grab('compile-errors').innerHTML = text || 'Ready';
	setc('compile-errors', 'invalid-json', text);
	setc('save-button', 'disabled', text);
}
function xss(text) {
	return text.replace('<', '&lt');
}
function nelem(type) {
	return document.createElement(type);
}
