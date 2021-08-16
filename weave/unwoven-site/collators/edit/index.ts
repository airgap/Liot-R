import { load, grab, bind, setc, addc } from '../../bonus.js';
import { Client } from '../../Client.js';
import { err, getPageId } from '../../script.js';
const liotR = new Client();
const id = getPageId();
let filters = [];
load(async () => {
	({ filters } = await liotR.listFilters({}));
	const collator = await liotR.getCollator(id);
	if (!collator) throw 'Unable to find a collator with that ID';

	console.log(collator);
	grab('item-id').innerHTML = '[' + collator.id + ']';
	grab('collator-name').value = collator.name || '';
	for (var filter of collator.filters) addFilter(filter);
	const refcount = (await liotR.countCollatorReferences([id]))?.collators?.[0]
		?.refcount;
	if (typeof refcount !== 'number')
		throw 'Cannot count collator reference count';
	grab('reference-count').innerHTML =
		'Used by ' + (refcount || 'no') + ' distributors.';
	console.log(refcount);
	if (refcount) addc('delete-button', 'disabled');
	if (refcount) grab('delete-button').innerHTML = 'Undeletable';
	//filters.push({id:filter.id,name:filter.name})
});
function addFilter(id) {
	const select = document.createElement('select');
	for (const filter of filters) {
		const option = document.createElement('option');
		option.value = filter.id;
		option.innerHTML = filter.name;
		select.appendChild(option);
		console.log(id);
		if (id && filter.id == id) option.selected = true;
	}
	const rem = document.createElement('label');
	rem.innerHTML = '-';
	const item = document.createElement('div');
	item.appendChild(rem);
	item.appendChild(select);
	grab('filter-list').insertBefore(item, grab('add-filter'));
	bind(rem, 'click', () => item.parentNode.removeChild(item));
}
const save = async () => {
	//addc('save-button', 'disabled');
	err('Creating collator...');
	await liotR.addCollator({
		name: grab('collator-name').value,
		filters: Array.from(document.getElementsByTagName('select')).map(
			({ value }) => value
		),
		id
	});
	location.href = '/collators';
};
const deletef = async () => {
	if (
		confirm(
			'Are you sure you wish to delete this collator? This action cannot be undone.'
		)
	) {
		await liotR.deleteCollators([id]);
		location.href = '/collators';
	}
};
