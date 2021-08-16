import { Client } from '../../Client.js';
import { bind, grab, load, setc } from '../../bonus.js';
import { getPageId } from '../../script.js';

const liotR = new Client();
const id = getPageId();

let collators = [];
load(async () => {
	collators = await liotR.listCollators({});
	const dist = await liotR.getDistributor(id);
	if (!dist) return;
	grab('distributor-name').value = dist.name ?? '';
	grab('distributor-push').checked = dist.push;
	grab('distributor-queue').checked = dist.queue;
	grab('distributor-callback').checked = dist.callback;
	grab('distributor-url').value = dist.url ?? '';
	grab('distributor-accessor').value = dist.accessor ?? '';
	grab('item-id').innerHTML = `[${dist.id}]`;
	for (const collator of dist.collators) addCollator(collator.id);
	bind('save-button', 'click', save);
	bind('delete-button', 'click', deletef);
	bind('add-collator', 'click', addCollator);
});
const addCollator = id => {
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
	bind(rem, 'click', () => item.parentNode.removeChild(item));
};
const save = async () => {
	//addc('save-button', 'disabled');
	err('Creating distributor...');
	await liotR.addDistributor({
		name: grab('distributor-name').value,
		push: grab('distributor-push').checked,
		queue: grab('distributor-queue').checked,
		callback: grab('distributor-callback').checked,
		url: grab('distributor-url').value,
		accessor: grab('distributor-accessor').value,
		collators: Array.from(document.getElementsByTagName('select')).map(
			({ value }) => value
		),
		id
	});
	location.href = '/distributors';
};
const deletef = async () => {
	if (
		confirm(
			'Are you sure you wish to delete this distributor? This action cannot be undone.'
		)
	) {
		await liotR.deleteDistributor(id);
		location.href = '/distributors';
	}
};
function err(text) {
	grab('compile-errors').innerHTML = text || 'Ready';
	setc('compile-errors', 'invalid-json', text);
	setc('save-button', 'disabled', text);
}
