import { load, grab, setc, bind } from '../../bonus';
import { LiotR } from '../../liotr';
const liotR = new LiotR();
var COMPARATORS = [
	'EQUALS',
	'NEQUALS',
	'TFNEQUALS',
	'OVER',
	'OVEROR',
	'UNDER',
	'UNDEROR'
];

var OPERATORS = ['AND', 'OR', 'NAND', 'NOR', 'XOR', 'SAME'];

var filterList;
var reg = location.href.match(/after=(-?[0-9]+)/);
var after = reg ? parseInt(reg[1]) : 0;
var filters = [];
load(() => {
	liotR.listFilters({}, res => {
		if (res.err) {
			console.log(res.err);
			return;
		}
		filters = res.filters;
		//for(var filter of res.filters)filters.push({id:filter.id,name:filter.name})
	});
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
function save() {
	//addc('save-button', 'disabled');
	err('Creating collator...');
	var name = grab('collator-name').value;
	var filtrets = [];
	var selects = document.getElementsByTagName('select');
	for (var i of selects) filtrets.push(i.value);
	liotR.addCollators(
		{
			collators: [
				{
					name: name,
					filters: filtrets
				}
			]
		},
		res => {
			if (res.err) {
				console.log(res.err);
				return;
			}
			location.href = '/collators';
		}
	);
}
function err(text) {
	grab('compile-errors').innerHTML = text || 'Ready';
	setc('compile-errors', 'invalid-json', text);
	setc('save-button', 'disabled', text);
}
