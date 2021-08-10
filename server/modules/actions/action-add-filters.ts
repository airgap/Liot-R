import {insertFilters} from '../insert-filters';
import {COMPARATORS} from "../ComparatorList";
import {OPERATORS} from "../OperatorList";


/**
 * Creates one or more packet filters.
 * @name Action: Add Filters
 * @function
 */
async function actionAddFilters(params, r) {
    if (!Array.isArray(params.filters))
        return {err: '`filters` must be a valid array'};
    const filters = [];
    for (const filter of params.filters) {
        const trans: any = {};
        if (typeof filter.name === "string")
            trans.name = filter.name;
        if (typeof filter.id === "string")
            trans.id = filter.id;
        if (typeof filter.code === "string") {
            const code = filter.code;
            let json;
            try {
                json = JSON.parse(code);
            } catch (error) {
                return {err: 'Invalid JSON'};
            }
            recur(json);

            function recur(tree, current?) {
                //console.log(tree, current);
                const top = typeof current == 'undefined';
                if (!top && ['number', 'string'].includes(typeof tree[current])) {
                    if (!COMPARATORS.includes(current))
                        return {err: 'All numbers and strings must reside in comparators.'};
                } else if (!Array.isArray(tree)) {
                    if (!top && current && !OPERATORS.includes(current))
                        return {err: 'Not a valid operator.'};
                    const keys = Object.keys(tree);
                    //console.log(top && keys.length != 1)
                    if (top && keys.length != 1)
                        return {err: "Root object must contain exactly one object, not " + keys.length};
                    if (!top && keys.length !== 2)
                        return {err: 'Operator ' + current + ' expects 2 parameters, not ' + keys.length};
                    for (const key of keys) {
                        if (!COMPARATORS.includes(key) && !OPERATORS.includes(key))
                            return {err: 'Invalid comparator or operator.'};
                        recur(tree[key], key);
                    }
                } else { // Tree is an array
                    //console.log('array: ' + current);
                    if (!COMPARATORS.includes(current))
                        return {err: 'Invalid comparator.'};
                    if (tree.length != 2)
                        return {err: 'All comparators expect 2 parameters. Found ' + tree.length};
                }
            }

            trans.code = filter.code;
            trans.json = json;
        }
        filters.push(trans);
    }
    try {
        await insertFilters(r, filters);
    } catch (err) {
        return {err: 'Error creating filters.'};
    }
}

module.exports = actionAddFilters;
