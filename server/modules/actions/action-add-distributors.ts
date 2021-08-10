import {insertDistributors} from '../insert-distributors';
import * as validUrl from 'valid-url';

/**
 * Creates one or more packet distributors.
 * @name Action: Add Distributors
 * @function
 */
async function actionAddDistributors(params, r) {
    if (!Array.isArray(params.distributors))
        return {err: '`distributors` must be a valid array'};
    const distributors = [];
    for (const distributor of params.distributors) {
        if(typeof distributor !== 'object')
            return {err: 'All distributors must be valid objects'};
        const trans: any = {collators: []};
        if (typeof distributor.id === "string")
            trans.id = distributor.id;
        if (Array.isArray(distributor.collators))
            for (const collator of distributor.collators)
                trans.collators.push(collator);
        if (typeof distributor.url === 'string' && validUrl.isUri(distributor.url))
            trans.url = distributor.url;
        if (typeof distributor.name === 'string' && distributor.name.length > 0)
            trans.name = distributor.name;
        trans.push = !!distributor.push;
        trans.queue = !!distributor.queue;
        trans.callback = !!distributor.callback;
        distributors.push(trans);
    }
    try {
        await insertDistributors(r, distributors);
    } catch (err) {
        console.error(err);
        return {err: 'Error creating distributors.'};
    }
    return {};
}

module.exports = actionAddDistributors;
