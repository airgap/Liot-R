"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bonus_1 = require("./bonus");
function grab(elem, root) {
    return typeof elem === 'string'
        ? (grab(root) || document).getElementById(elem)
        : elem;
}
function bind(elem, trigger, func) {
    elem.addEventListener(trigger, func);
}
function load(func) {
    bind(window, 'DOMContentLoaded', func);
}
function xss(text) {
    return text.replace('<', '&lt');
}
function nelem(type) {
    return document.createElement(type);
}
function namify(rec, type, editing) {
    var name = xss(rec.name || ''), id = xss(rec.id);
    var edit = `<a class='title-edit${editing ? ' disabled' : ''}' href='/${type}s/edit?id=${rec.id}'>edit${editing ? 'ing' : ''}</a>`;
    return ((name.length
        ? name
        : '<i>Unnamed ' + type[0].toUpperCase() + type.substr(1) + '</i>') +
        edit +
        " <span class='name-id'>[" +
        id +
        ']</span>');
    /*return rec.name && rec.name.length ?
      name + edit + " <span class='name-id'>["+id+"]</span>" :
      `[${id}]` + edit;*/
}
function appendCollators(collators, to, id) {
    for (var i = 0; i < collators.length; i++) {
        var rec = collators[i];
        var bubble = nelem('div');
        bonus_1.addc(bubble, 'bubble');
        var top = nelem('div');
        bonus_1.addc(top, 'bubble-top');
        bubble.appendChild(top);
        var nameBox = nelem('label');
        nameBox.innerHTML = namify(rec, 'collator', id == rec.id);
        //xss((rec.name || "["+rec.id+"]") + "");
        var idBox = nelem('label');
        idBox.innerHTML = xss(rec.id);
        var valBox = nelem('label');
        //addc(valBox, 'filters-tooltip');
        var filternames = '';
        var filterNodes = [];
        for (var filtret of rec.filtrets) {
            filternames += (filtret.name || filtret.id.substring(0, 10)) + ', ';
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
        filternames =
            '(' + filternames.substring(0, filternames.length - 2) + ')';
        valBox.innerHTML = xss(filternames);
        top.appendChild(nameBox);
        //top.appendChild(valBox);
        for (var n of filterNodes)
            bubble.appendChild(n);
        //bubble.appendChild(idBox);
        //console.log(filtret.code)
        to.appendChild(bubble);
        appendFilters(rec.filtrets, bubble, id);
        appendDropper(bubble);
        appendSpecifics(bubble, rec.id, 'collator');
        //bindBubble(bubble,rec)
    }
    if (!collators.length)
        appendPlaceholder('collators', to);
}
function appendPlaceholder(type, to) {
    var span = nelem('div');
    bonus_1.addc(span, 'placehodler');
    span.innerHTML = 'No ' + type;
    to.appendChild(span);
}
function appendFilters(filters, filterList, id) {
    for (var i = 0; i < filters.length; i++) {
        var rec = filters[i];
        var bubble = nelem('div');
        bonus_1.addc(bubble, 'bubble');
        var top = nelem('div');
        bonus_1.addc(top, 'bubble-top');
        bubble.appendChild(top);
        var nameBox = nelem('label');
        nameBox.innerHTML = namify(rec, 'filter', id == rec.id); //xss((rec.name || rec.id));
        var idBox = nelem('label');
        idBox.innerHTML = xss(rec.id);
        var valBox = nelem('pre');
        valBox.innerHTML = codify(xss(rec.code));
        top.appendChild(nameBox);
        bubble.appendChild(valBox);
        //bubble.appendChild(idBox);
        filterList.appendChild(bubble);
        appendDropper(bubble);
        //bindBubble(bubble,rec)
        appendSpecifics(bubble, rec.id, 'filter');
    }
    if (!filters.length)
        appendPlaceholder('filters', filterList);
}
function appendCollectors(filters, filterList, id) {
    for (var i = 0; i < filters.length; i++) {
        var rec = filters[i];
        var bubble = nelem('div');
        bonus_1.addc(bubble, 'bubble');
        var top = nelem('div');
        bonus_1.addc(top, 'bubble-top');
        bubble.appendChild(top);
        var nameBox = nelem('label');
        nameBox.innerHTML = namify(rec, 'collector', id == rec.id); //xss((rec.name || rec.id));
        var idBox = nelem('label');
        idBox.innerHTML = xss(rec.id);
        var valBox = nelem('pre');
        valBox.innerHTML = valify(xss(JSON.stringify(rec, null, 3)));
        top.appendChild(nameBox);
        bubble.appendChild(valBox);
        //bubble.appendChild(idBox);
        filterList.appendChild(bubble);
        appendDropper(bubble);
        //bindBubble(bubble,rec)
        appendSpecifics(bubble, rec.id, 'collector');
    }
    if (!filters.length)
        appendPlaceholder('collectors', filterList);
}
function appendSpecifics(bubble, id, type) {
    /*var bottom = nelem('div');
    addc(bottom, 'bubble-bottom');
    var edit = nelem('a');
    edit.innerHTML = "Edit " + type[0].toUpperCase() + type.substring(1);
    edit.href = "edit-" + type + ".php?id=" + id;
    bottom.appendChild(edit);
    bubble.appendChild(bottom);*/
}
function stringValue(value) {
    switch (typeof value) {
        case 'object':
            value = JSON.stringify(value);
        case 'string':
            if (value.length < 30) {
                if (value.length == 0)
                    value = 'NO VALUE';
                return value;
            }
            else {
                return value.substring(0, 27) + '...';
            }
            break;
        case 'number':
            return value + '';
            break;
    }
    return value;
}
function codify(string) {
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
function valify(string) {
    string = string
        .replace(/([:,]) ([0-9]+)(,|\n| \])/g, '$1 %%n%%$2%%n%%$3')
        .replace(/"(\$.+?)"/g, '%%v%%$1%%v%%')
        //.replace(/(?:^\s+)([^%])("[^$].+?")([^%])/g, "$1%%s%%$2%%s%%$3")
        .replace(/^(\s+)"([A-Z]+)"/gm, '$1%%c%%$2%%c%%')
        .replace(/"([^$].+?)"/g, '%%s%%$1%%s%%')
        .replace(/%%n%%(.+?)%%n%%/g, '<span class="number">$1</span>')
        .replace(/%%s%%([a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12})%%s%%/g, '<span class="id">$1</span>')
        .replace(/%%s%%(.+?)%%s%%/g, '<span class="string">$1</span>')
        .replace(/%%c%%(.+?)%%c%%/g, '<span class="command">$1</span>')
        .replace(/%%v%%(.+?)%%v%%/g, '<span class="variable">$1</span>')
        .replace(/([:,]) (true|false)(,|\n| \])/g, '$1 <span class="binary">$2$3</span>');
    return string;
    /*.replace(/([0-9])+/g,'<span class="number">$1</span>')
    .replace(/(?!<span class=|^\s+)(".+?")(?!>|: [{\[])/g,'<span class="string">$1</span>')*/
}
function appendDropper(bubble) {
    var dropper = nelem('div');
    dropper.innerHTML = 'V';
    bonus_1.addc(dropper, 'dropper');
    bind(bubble.children[0], 'click', e => {
        bonus_1.togc(bubble, 'dropped');
        //e.preventDefault();
        return false;
    });
    bubble.appendChild(dropper);
}
function bindBubble(bubble, rec) {
    bind(bubble, 'click', () => {
        location.href = '/filters/edit?id=' + rec.id;
    });
}
function getPageId() {
    var id = location.href.match(/\?id=(.+)$/);
    return id ? id[1] : 0;
}
