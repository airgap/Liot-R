import { bind, grab, load, setc } from '../../bonus';
import { LiotR } from '../../liotr';

const liotR = new LiotR();
let collators = [];
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
	const filterList = grab('filter-list');
	filterList.insertBefore(item, grab('add-filter'));
	bind(rem, 'click', () => filterList.removeChild(item));
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
					collators: Array.from(
						document.getElementsByTagName('select')
					).map(({ value }) => value)
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
