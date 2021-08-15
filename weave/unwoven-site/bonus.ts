/* JS helpers -- feel free to steal them! */

/* check if param is string or element. if string, get element of that id */

/* e.g. grab('myelem') or grab(myelem) */
export function grab(elem) {
	if (typeof elem === 'string') {
		var o = [];
		elem.split('|').forEach(x => o.push(document.getElementById(x)));
		return o.length == 1 ? o[0] : o;
	}
	return elem;
}

/* add an event listener to an element. if element is string, grab() it. */

/* e.g. bind(myelem, 'click', ()=>{}) */
export function bind(elem, evt, func) {
	iterate(grab(elem), x => x.addEventListener(evt, func));
}

/* run function when window is loaded. uses event listener, not window.onload = */

/* e.g. load(()=>{}) */
export function load(func) {
	iterate(func, x => bind(window, 'load', x));
}

/* output text to grab('log') element */

/* e.g. log('oops') */
export function log(text) {
	grab('log').innerHTML = text;
}

/* remove class from element */

/* e.g. remc(myelem) or remc('myelem') */
export function remc(elem, clas) {
	iterate(grab(elem), x => {
		x.classList.remove(clas);
	});
}

/* add class to element */

/* e.g. addc(myelem, 'hidden') or addc('myelem', 'myclass') */
export function addc(elem, clas) {
	iterate(grab(elem), x => {
		x.classList.add(clas);
	});
}

/*check if element has class */

/* e.g. x = hasc(myelem, 'myclass') or x = hasc('myelem', 'myclass') */
export function hasc(elem, clas) {
	return grab(elem).classList.contains(clas);
}

/* toggle class of element, returns if element now has class */

/* e.g. x = togc(myelem, 'myclass') or x = togc('myelem', 'myclass') */
export function togc(elem, clas) {
	var e = grab(elem);
	var hc = hasc(e, clas);
	if (hc) remc(e, clas);
	else addc(e, clas);
	return !hc;
}

export function togcp(elem, clas) {
	iterate(grab(elem), e => {
		var hc = hasc(e, clas);
		if (hc) remc(e, clas);
		else addc(e, clas);
	});
} //togc plus

/* set whether element has class */

/* e.g. setc(myelem, 'myclass', true) or setc('myelem', 'myclass', 0) */
export function setc(elem, clas, to) {
	iterate(grab(elem), e => {
		if (to) addc(e, clas);
		else remc(e, clas);
	});
}

export function iterate(elems, func) {
	if (Array.isArray(elems)) elems.forEach(func);
	else func(elems);
}

export function retrieve(path, callback) {
	var e = new XMLHttpRequest();
	e.open('GET', path);
	bind(e, 'load', () => {
		callback(e);
	});
	return e;
}

/* end of freely stealable code */

export const BS = zone => {
	const addClass = (e, c) => {
			e.classList.add(c);
		},
		remClass = (e, c) => {
			e.classList.remove(c);
		},
		setClass = (e, c, v) => {
			if (v) addClass(e, c);
			else remClass(e, c);
		},
		bindbox = box => {
			const correct = box.getAttribute('bs-correct'),
				incorrect = box.getAttribute('bs-incorrect'),
				empty = box.getAttribute('bs-empty');
			//var regex = box.getAttribute('bigbox-regex');
			box.children[1].innerHTML = empty;
			box.addEventListener('input', () =>
				dotype(
					box,
					box.children[0],
					box.children[1],
					correct,
					incorrect,
					empty
				)
			);
			box.addEventListener('mousedown', () => {
				setTimeout(() => {
					box.children[0].focus();
				}, 0);
			});
		},
		place = (zone || document).getElementsByClassName('bs-textbox');
	for (let bi = 0; bi < place.length; bi++) bindbox(place[bi]);

	function dotype(box, inb, lab, correct, incorrect, empty) {
		let good = false;
		const inp = inb.value;
		setClass(box, 'occupied', inp.length);
		const reg = getRegex(box);
		if (!inp.length) lab.innerHTML = empty;
		else if (reg.test(inp)) {
			good = true;
			lab.innerHTML = correct;
		} else lab.innerHTML = incorrect;
		inb.setAttribute('bs-valid', good);
	}
};

function getRegex(box) {
	const regex = box.getAttribute('bs-regex'),
		end = regex.lastIndexOf('/');
	return new RegExp(regex.substring(1, end), regex.substr(end + 1));
}

BS.check = box => box.getAttribute('bs-valid') == 'true';

load(BS);
