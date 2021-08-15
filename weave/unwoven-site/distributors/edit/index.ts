import { LiotR } from '../../liotr.js';
import { bind, grab, load, setc } from '../../bonus.js';
import { getPageId } from '../../script.js';

const liotR = new LiotR();
var ID = getPageId();
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

var collatorList;
var reg = location.href.match(/after=(-?[0-9]+)/);
var after = reg ? parseInt(reg[1]) : 0;
var collators = [];
load(() => {
	liotR.listCollators({}, res => {
		if (res.err) {
			console.log(res.err);
			return;
		}
		collators = res.collators;
		liotR.getDistributors({ ids: [ID] }, res => {
			if (res.distributors && res.distributors.length) {
				var dist = res.distributors[0];
				console.log(dist);
				grab('distributor-name').value = dist.name || '';
				grab('distributor-push').checked = dist.push;
				grab('distributor-queue').checked = dist.queue;
				grab('distributor-callback').checked = dist.callback;
				grab('distributor-url').value = dist.url || '';
				grab('distributor-accessor').value = dist.accessor || '';
				grab('item-id').innerHTML = '[' + dist.id + ']';
				for (var collator of dist.collators) addCollator(collator.id);
			}
		});
		//for(var collator of res.collators)collators.push({id:collator.id,name:collator.name})
	});
});
function addCollator(id) {
	var select = document.createElement('select');
	for (var collator of collators) {
		var option = document.createElement('option');
		option.value = collator.id;
		option.innerHTML = collator.name || `[ ${collator.id} ]`;
		select.appendChild(option);
		if (id && collator.id == id) option.selected = true;
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
	err('Creating distributor...');
	var name = grab('distributor-name').value;
	var push = grab('distributor-push').checked;
	var queue = grab('distributor-queue').checked;
	var callback = grab('distributor-callback').checked;
	var url = grab('distributor-url').value;
	var accessor = grab('distributor-accessor').value;
	var filtrets = [];
	var selects = document.getElementsByTagName('select');
	for (var i of selects) filtrets.push(i.value);
	liotR.addDistributors(
		{
			distributors: [
				{
					name: name,
					push: push,
					queue: queue,
					callback: callback,
					url: url,
					accessor: accessor,
					collators: filtrets,
					id: ID
				}
			]
		},
		res => {
			if (res.err) {
				console.log(res.err);
				return;
			}
			location.href = '/distributors';
		}
	);
}
function deletef() {
	if (
		confirm(
			'Are you sure you wish to delete this distributor? This action cannot be undone.'
		)
	) {
		liotR.deleteDistributors({ ids: [ID] }, res => {
			location.href = '/distributors';
		});
	}
}
function err(text) {
	grab('compile-errors').innerHTML = text || 'Ready';
	setc('compile-errors', 'invalid-json', text);
	setc('save-button', 'disabled', text);
}
