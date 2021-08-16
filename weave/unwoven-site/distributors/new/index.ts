import { bind, grab, load, setc } from '../../bonus';
import { Client } from '../../Client';

const liotR = new Client();
let collators = [];
load(async () => {
	collators = await liotR.listCollators({});
	bind('add-collator', 'click', addCollator);
	bind('save', 'click', save);
});
const addCollator = () => {
	const select = document.createElement('select');
	for (const collator of collators) {
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
	const collatorList = grab('collator-list');
	collatorList.insertBefore(item, grab('add-collator'));
	bind(rem, 'click', () => collatorList.removeChild(item));
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
		collators: Array.from(document.getElementsByTagName('select')).map(
			({ value }) => value
		)
	});
	location.href = '/distributors';
};
function err(text) {
	grab('compile-errors').innerHTML = text || 'Ready';
	setc('compile-errors', 'invalid-json', text);
	setc('save-button', 'disabled', text);
}
