import { addc, bind, togc } from './bonus.js';
export function grab(elem, root?) {
	return typeof elem === 'string'
		? (grab(root) || document).getElementById(elem)
		: elem;
}

export function xss(text) {
	return text.replace('<', '&lt');
}
export function nelem(type) {
	return document.createElement(type);
}

export function namify(rec, type, editing = false) {
	var name = xss(rec.name || ''),
		id = xss(rec.id);
	var edit = `<a class='title-edit${
		editing ? ' disabled' : ''
	}' href='/${type}s/edit?id=${rec.id}'>edit${editing ? 'ing' : ''}</a>`;
	return (
		(name.length
			? name
			: '<i>Unnamed ' + type[0].toUpperCase() + type.substr(1) + '</i>') +
		edit +
		" <span class='name-id'>[" +
		id +
		']</span>'
	);
	/*return rec.name && rec.name.length ?
	  name + edit + " <span class='name-id'>["+id+"]</span>" :
	  `[${id}]` + edit;*/
}

export function appendCollators(collators, to, id?) {
	for (let i = 0; i < collators.length; i++) {
		const rec = collators[i];
		const bubble = nelem('div');
		addc(bubble, 'bubble');
		const top = nelem('div');
		addc(top, 'bubble-top');
		bubble.appendChild(top);
		const nameBox = nelem('label');
		nameBox.innerHTML = namify(rec, 'collator', id == rec.id);
		//xss((rec.name || "["+rec.id+"]") + "");
		const idBox = nelem('label');
		idBox.innerHTML = xss(rec.id);

		const valBox = nelem('label');
		//addc(valBox, 'filters-tooltip');
		let filterNames = '';
		const filterNodes = [];
		for (const filtret of rec.filtrets) {
			filterNames += (filtret.name ?? filtret.id.substring(0, 10)) + ', ';
			/*var filterBox = nelem('div');
			addc(filterBox, 'bubble');
			addc(filterBox, 'subble');
			var filterName = nelem('label');
			var filterCode = nelem('pre');
			filterName.innerHTML = filtret.name;
			filterCode.innerHTML = filtret.code;
			filterBox.appendChild(filterName);
			filterBox.appendChild(filterCode);
			filterNodes.push(filterBox);
			appendDropper(filterBox);*/
		}
		filterNames =
			'(' + filterNames.substring(0, filterNames.length - 2) + ')';
		valBox.innerHTML = xss(filterNames);
		top.appendChild(nameBox);
		//top.appendChild(valBox);
		for (const n of filterNodes) bubble.appendChild(n);
		//bubble.appendChild(idBox);
		//console.log(filtret.code)
		to.appendChild(bubble);
		appendFilters(rec.filtrets, bubble, id);
		appendDropper(bubble);
		appendSpecifics(bubble, rec.id, 'collator');
		//bindBubble(bubble,rec)
	}
	if (!collators.length) appendPlaceholder('collators', to);
}

export function appendPlaceholder(type, to) {
	const span = nelem('div');
	addc(span, 'placehodler');
	span.innerHTML = 'No ' + type;
	to.appendChild(span);
}

export function appendFilters(filters, filterList, id?) {
	for (let i = 0; i < filters.length; i++) {
		const rec = filters[i];
		const bubble = nelem('div');
		addc(bubble, 'bubble');
		const top = nelem('div');
		addc(top, 'bubble-top');
		bubble.appendChild(top);
		const nameBox = nelem('label');
		nameBox.innerHTML = namify(rec, 'filter', id == rec.id); //xss((rec.name || rec.id));
		const idBox = nelem('label');
		idBox.innerHTML = xss(rec.id);

		const valBox = nelem('pre');
		valBox.innerHTML = codify(xss(rec.code));
		top.appendChild(nameBox);
		bubble.appendChild(valBox);
		//bubble.appendChild(idBox);
		filterList.appendChild(bubble);
		appendDropper(bubble);
		//bindBubble(bubble,rec)
		appendSpecifics(bubble, rec.id, 'filter');
	}
	if (!filters.length) appendPlaceholder('filters', filterList);
}

export function appendCollectors(filters, filterList, id?) {
	for (let i = 0; i < filters.length; i++) {
		const rec = filters[i];
		const bubble = nelem('div');
		addc(bubble, 'bubble');
		const top = nelem('div');
		addc(top, 'bubble-top');
		bubble.appendChild(top);
		const nameBox = nelem('label');
		nameBox.innerHTML = namify(rec, 'collector', id == rec.id); //xss((rec.name || rec.id));
		const idBox = nelem('label');
		idBox.innerHTML = xss(rec.id);

		const valBox = nelem('pre');
		valBox.innerHTML = valify(xss(JSON.stringify(rec, null, 3)));
		top.appendChild(nameBox);
		bubble.appendChild(valBox);
		//bubble.appendChild(idBox);
		filterList.appendChild(bubble);
		appendDropper(bubble);
		//bindBubble(bubble,rec)
		appendSpecifics(bubble, rec.id, 'collector');
	}
	if (!filters.length) appendPlaceholder('collectors', filterList);
}

export function appendSpecifics(bubble, id, type) {
	/*var bottom = nelem('div');
	addc(bottom, 'bubble-bottom');
	var edit = nelem('a');
	edit.innerHTML = "Edit " + type[0].toUpperCase() + type.substring(1);
	edit.href = "edit-" + type + ".php?id=" + id;
	bottom.appendChild(edit);
	bubble.appendChild(bottom);*/
}

export function stringValue(value: unknown) {
	const valType = typeof value;
	if (valType === 'object') value = JSON.stringify(value);
	switch (typeof value) {
		case 'string':
			return value.length < 30
				? value.length === 0
					? 'NO VALUE'
					: value
				: value.substring(0, 27) + '...';
		case 'number':
			return value.toString();
	}
	return value;
}

export function codify(string) {
	string = string
		.replace(/([:,]) ([0-9]+)(,|\n| \])/g, '$1 %%n%%$2%%n%%$3')
		//.replace(/([0-9]+)/g, '%%n%%$1%%n%%')
		.replace(/"(\$.+?)"/g, '%%v%%$1%%v%%')
		//.replace(/(?:^\s+)([^%])("[^$].+?")([^%])/g, "$1%%s%%$2%%s%%$3")
		.replace(/^(\s+)"([A-Z]+)"/gm, '$1%%c%%$2%%c%%')
		.replace(/"([^$].+?)"/g, '%%s%%$1%%s%%')
		.replace(/%%n%%(.+?)%%n%%/g, '<span class="number">$1</span>')
		.replace(/%%s%%(.+?)%%s%%/g, '<span class="string">$1</span>')
		.replace(/%%c%%(.+?)%%c%%/g, '<span class="command">$1</span>')
		.replace(/%%v%%(.+?)%%v%%/g, '<span class="variable">$1</span>');
	return string;
	/*.replace(/([0-9])+/g,'<span class="number">$1</span>')
	.replace(/(?!<span class=|^\s+)(".+?")(?!>|: [{\[])/g,'<span class="string">$1</span>')*/
}

export const valify = (text: string) =>
	text
		.replace(/([:,]) ([0-9]+)(,|\n| \])/g, '$1 %%n%%$2%%n%%$3')
		.replace(/"(\$.+?)"/g, '%%v%%$1%%v%%')
		//.replace(/(?:^\s+)([^%])("[^$].+?")([^%])/g, "$1%%s%%$2%%s%%$3")
		.replace(/^(\s+)"([A-Z]+)"/gm, '$1%%c%%$2%%c%%')
		.replace(/"([^$].+?)"/g, '%%s%%$1%%s%%')
		.replace(/%%n%%(.+?)%%n%%/g, '<span class="number">$1</span>')
		.replace(
			/%%s%%([a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12})%%s%%/g,
			'<span class="id">$1</span>'
		)
		.replace(/%%s%%(.+?)%%s%%/g, '<span class="string">$1</span>')
		.replace(/%%c%%(.+?)%%c%%/g, '<span class="command">$1</span>')
		.replace(/%%v%%(.+?)%%v%%/g, '<span class="variable">$1</span>')
		.replace(
			/([:,]) (true|false)(,|\n| \])/g,
			'$1 <span class="binary">$2$3</span>'
		);

export function appendDropper(bubble) {
	const dropper = nelem('div');
	dropper.innerHTML = 'V';
	addc(dropper, 'dropper');
	bind(bubble.children[0], 'click', e => {
		togc(bubble, 'dropped');
		//e.preventDefault();
		return false;
	});
	bubble.appendChild(dropper);
}

export const bindBubble = (bubble, { id }) =>
	bind(bubble, 'click', () => (location.href = `/filters/edit?id=${id}`));

export const getPageId = () => location.href.match(/\?id=(.+)$/)?.[1] ?? 0;
