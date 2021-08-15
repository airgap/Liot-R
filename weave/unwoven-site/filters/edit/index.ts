//The filter ID from the URL
import { appendCollators, getPageId } from '../../script.js';
import { addc, bind, grab, load, setc } from '../../bonus.js';
import { LiotRClient } from '../../liotRClient.js';
const liotR = new LiotRClient();
var ID = getPageId();

//Comparators for the Liot filter code JSON parser
var COMPARATORS = [
	'EQUALS',
	'NEQUALS',
	'TFNEQUALS',
	'OVER',
	'OVEROR',
	'UNDER',
	'UNDEROR'
];

//Operators for the Liot filter code JSON parser

var OPERATORS = ['AND', 'OR', 'NAND', 'NOR', 'XOR', 'SAME'];

//Prep form when page is loaded
load(() => {
	//Get the details for the selected filter
	liotR.getFilters({ ids: [ID] }, res => {
		var filter;
		//Ensure a filter was actually returned; if so, populate form
		if (res.filters && (filter = res.filters[0])) {
			grab('item-id').innerHTML = '[' + filter.id + ']';
			grab('filter-name').value = filter.name || '';
			grab('filter-code').value = filter.code || '{}';
		}
		//List all the collators referring to the filter
		liotR.listFilterReferrers({ ids: [ID] }, res => {
			if (res.err || !res.filters.length) {
				console.log(err || 'No filter found.');
				return;
			}
			//Dump the list to console
			console.log(res);
			//Only one filter was queried; select it
			var filt = res.filters[0];
			//Count the number of collators referencing it
			grab('reference-count').innerHTML =
				'Used by ' + filt.referrers.length + ' collators.';
			//List and link to the collators referencing it
			var referrerList = grab('referrer-list');
			appendCollators(filt.referrers, referrerList, ID);
			//disable the delete button if the filter is referenced by any
			if (filt.referrers.length) addc('delete-button', 'disabled');
			if (filt.referrers.length)
				grab('delete-button').innerHTML = 'Undeletable';
		});
	});
	//Get the filter's code box in the form
	var codeBox = grab('filter-code');
	//Validate the filter code
	bind(codeBox, 'input', () => {
		var code = codeBox.value;
		var json;
		try {
			json = JSON.parse(code);
			err();
		} catch (error) {
			err('Invalid JSON.');
			return;
		}
		var queued = 0;
		recur(json);
		function recur(tree, current?) {
			//console.log(tree, current);
			queued++;
			var top = typeof current == 'undefined';
			if (
				!top &&
				(typeof tree[current] === 'number' ||
					typeof tree[current] === 'string')
			) {
				if (!COMPARATORS.includes(current)) {
					err('All numbers and strings must reside in comparators.');
					return;
				}
			} else if (!Array.isArray(tree)) {
				if (!top && current && !OPERATORS.includes(current)) {
					err('Not a valid operator.');
					return;
				}
				var keys = Object.keys(tree);
				console.log(top && keys.length != 1);
				if (top && keys.length != 1) {
					err(
						'Root object must contain exactly one object, not ' +
							keys.length
					);
					return;
				}
				if (top || keys.length === 2) {
					for (var key of keys) {
						if (COMPARATORS.includes(key)) {
							recur(tree[key], key);
						} else if (OPERATORS.includes(key)) {
							recur(tree[key], key);
						} else {
							err('Invalid comparator or operator.');
							return;
						}
					}
				} else {
					err(
						'Operator ' +
							current +
							' expects 2 parameters, not ' +
							keys.length
					);
					return;
				}
			} else if (Array.isArray(tree)) {
				console.log('array: ' + current);
				if (!COMPARATORS.includes(current)) {
					err('Invalid comparator.');
					return;
				}
				if (tree.length != 2) {
					err(
						'All comparators expect 2 parameters. Found ' +
							tree.length
					);
					return;
				}
			}
			queued--;
			//if(!queued)console.log("Done!");
		}
	});
});
//Save the filter to the database
function save() {
	//addc('save-button', 'disabled');
	err('Updating filter...');
	var name = grab('filter-name').value;
	var code = grab('filter-code').value;
	liotR.addFilters(
		{
			filters: [
				{
					name: name,
					code: code,
					id: ID
				}
			]
		},
		res => {
			if (res.err) {
				console.log(res.err);
				return;
			}
			location.href = '/filters';
		}
	);
}
//Delete the filter
function deletef() {
	if (
		confirm(
			'Are you sure you wish to delete this filter? This action cannot be undone.'
		)
	) {
		liotR.deleteFilters({ ids: [ID] }, res => {
			location.href = 'filters';
		});
	}
}

//Logging
function err(text = '') {
	/*grab('compile-errors').innerHTML = text||"Ready";
	setc('compile-errors', 'invalid-json', text)*/
	console.log(text);
	setc('save-button', 'disabled', text);
}
