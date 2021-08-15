import { bind, grab, load, setc } from '../../bonus';
import { LiotR } from '../../liotr';

const liotR = new LiotR();
var collators = [];
load(() => {
	liotR.listCollators({}, res => {
		if (res.err) {
			console.log(res.err);
			return;
		}
		collators = res.collators;
		//for(var collator of res.collators)collators.push({id:collator.id,name:collator.name})
	});
	bind('add-collator', 'click', addCollator);
	bind('save', 'click', save);
});
function addCollator() {
	const select = document.createElement('select');
	for (var collator of collators) {
		const option = document.createElement('option');
		option.value = collator.id;
		option.innerHTML = collator.name || `[ ${collator.id} ]`;
		select.appendChild(option);
	}
	const rem = document.createElement('label');
	rem.innerHTML = '-';
	const item = document.createElement('div');
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
					collators: filtrets
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
function err(text) {
	grab('compile-errors').innerHTML = text || 'Ready';
	setc('compile-errors', 'invalid-json', text);
	setc('save-button', 'disabled', text);
}
