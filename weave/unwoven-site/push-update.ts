import { grab, setc } from './bonus.js';
import { Client } from './Client.js';

const liotR = new Client();

function save() {
	//addc('save-button', 'disabled');
	err('Creating distributor...');
	var update = grab('update').value;

	liotR.pushUpdate(JSON.parse(update), res => {
		if (res.err) {
			console.log(res.err);
			return;
		}
		location.href = '/distributors';
	});

	//Liotr.pushUpdate({value:98,accessor:'<AUTH_CODE>'});
}

function err(text) {
	grab('compile-errors').innerHTML = text || 'Ready';
	setc('compile-errors', 'invalid-json', text);
	setc('save-button', 'disabled', text);
}
