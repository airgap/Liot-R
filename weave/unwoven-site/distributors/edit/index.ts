import { LiotRClient } from '../../liotRClient.js';
import { bind, grab, load, setc } from '../../bonus.js';
import { getPageId } from '../../script.js';

const liotR = new LiotRClient();
const ID = getPageId();

let collators = [];
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
				grab('distributor-name').value = dist.name ?? '';
				grab('distributor-push').checked = dist.push;
				grab('distributor-queue').checked = dist.queue;
				grab('distributor-callback').checked = dist.callback;
				grab('distributor-url').value = dist.url ?? '';
				grab('distributor-accessor').value = dist.accessor ?? '';
				grab('item-id').innerHTML = '[' + dist.id + ']';
				for (const collator of dist.collators) addCollator(collator.id);
			}
		});
		//for(var collator of res.collators)collators.push({id:collator.id,name:collator.name})
	});
	bind('save-button', 'click', save);
	bind('delete-button', 'click', deletef);
	bind('add-collator', 'click', addCollator);
});
function addCollator(id) {
	const select = document.createElement('select');
	for (const collator of collators) {
		const option = document.createElement('option');
		option.value = collator.id;
		option.innerHTML = collator.name || `[ ${collator.id} ]`;
		select.appendChild(option);
		if (id && collator.id == id) option.selected = true;
	}
	const rem = document.createElement('label');
	rem.innerHTML = '-';
	const item = document.createElement('div');
	item.appendChild(rem);
	item.appendChild(select);
	grab('collator-list').insertBefore(item, grab('add-collator'));
	bind(rem, 'click', k => {
		item.parentNode.removeChild(item);
	});
}
function save() {
	//addc('save-button', 'disabled');
	err('Creating distributor...');
	liotR.addDistributors(
		{
			distributors: [
				{
					name: grab('distributor-name').value,
					push: grab('distributor-push').checked,
					queue: grab('distributor-queue').checked,
					callback: grab('distributor-callback').checked,
					url: grab('distributor-url').value,
					accessor: grab('distributor-accessor').value,
					collators: Array.from(
						document.getElementsByTagName('select')
					).map(({ value }) => value),
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
