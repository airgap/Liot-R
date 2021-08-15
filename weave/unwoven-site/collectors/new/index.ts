import { LiotR } from '../../liotr';
import { grab, setc } from '../../bonus';
const liotR = new LiotR();
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
