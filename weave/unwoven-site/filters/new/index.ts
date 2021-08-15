import { LiotRClient } from '../../liotRClient';
import { bind, grab, load, setc } from '../../bonus';

const liotR = new LiotRClient();
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
load(() => {
	var compileErrors = grab('compile-errors');
	var codeBox = grab('filter-code');
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
function save() {
	//addc('save-button', 'disabled');
	err('Creating filter...');
	var name = grab('filter-name').value;
	var code = grab('filter-code').value;
	liotR.addFilters(
		{
			filters: [
				{
					name: name,
					code: code
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
function err(text?) {
	grab('compile-errors').innerHTML = text || 'Ready';
	setc('compile-errors', 'invalid-json', text);
	setc('save-button', 'disabled', text);
}
