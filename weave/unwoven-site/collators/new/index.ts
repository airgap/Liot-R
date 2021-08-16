import { load, grab, setc, bind } from '../../bonus.js';
import { Client } from '../../Client';
const liotR = new Client();

var filterList;
var filters = [];
load(async () => {
	filters = await liotR.listFilters({});
});
function addFilter() {
	var select = document.createElement('select');
	for (var filter of filters) {
		var option = document.createElement('option');
		option.value = filter.id;
		option.innerHTML = filter.name;
		select.appendChild(option);
	}
	var rem = document.createElement('label');
	rem.innerHTML = '-';
	var item = document.createElement('div');
	item.appendChild(rem);
	item.appendChild(select);
	grab('filter-list').insertBefore(item, grab('add-filter'));
	bind(rem, 'click', k => {
		item.parentNode.removeChild(item);
	});
}
const save = async () => {
	await liotR.addCollator({
		name: grab('collator-name').value,
		filters: Array.from(document.getElementsByTagName('select')).map(
			({ value }) => value
		)
	});
	location.href = '/collators';
};
function err(text) {
	grab('compile-errors').innerHTML = text || 'Ready';
	setc('compile-errors', 'invalid-json', text);
	setc('save-button', 'disabled', text);
}
