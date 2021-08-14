// TO-DO: bake filters and distributors into each filter if filter has Hypercaching enabled
import * as validUrl from 'valid-url';
import { sendDataToCallback } from './sendDataToCallback';
import * as operators from './operators/operators';
import { getDistributorsWithFilters } from './getDistributorsWithFilters';
const operatorList = Object.values(operators);

// Please don't ask me how this works
export const distributeUpdate = async (updateResult, update, r) => {
	if (updateResult && typeof updateResult.changes[0].new_val == 'object') {
		const nv = updateResult.changes[0].new_val;
		const distributors = await getDistributorsWithFilters(r);
		//if(DEBUG)console.log(err || rows)
		const filters = {};
		const distributedData = [];
		// Oh god no
		for (const distributor of distributors)
			for (const collator of distributor.collators)
				for (const filter of collator.filters)
					if (!filters.hasOwnProperty(filter.id))
						filters[filter.id] = filter.json;
		console.log(filters);
		const keys = Object.keys(filters);
		for (const k of keys)
			if (evaluateLogic(filters[k], nv, 'ROOT')) {
				filters[k] = true;
			}
		const callbackPromises: Promise<any>[] = [];
		// OH GOD NO
		for (const distributor of distributors)
			for (const collator of distributor.collators) {
				let pass = false;
				for (const filter of collator.filters)
					if (filters[filter.id]) {
						// How many scopes deep did I feel the need to go?
						// I really must untangle this spaghetti sometime,
						// it's an insult to my Italian heritage.
						const data = JSON.parse(JSON.stringify(update));
						if (distributor.accessor)
							data.accessor = distributor.accessor;

						if (distributor.push && !distributor.queue)
							data.id = r.uuid(data.id + ' ' + distributor.id);
						data.distributor = distributor.id;
						//dostributors.push({id:distributor.id,accessor:distributor.accessor})
						distributedData.push(data);
						if (
							distributor.callback &&
							validUrl.isUri(distributor.url)
						)
							callbackPromises.push(
								sendDataToCallback(data, distributor.url)
							);
						else if (distributor.push)
							try {
								// It keeps getting deeper...
								const inserted = await r
									.table('DistributedData')
									.insert(distributedData);
								console.log('inserted', inserted);
							} catch (err) {
								console.error(err);
							}

						pass = true;
						break;
					}
				if (pass) break;
			}
		await Promise.allSettled(callbackPromises);
		console.log('PASS');
		return {};
	}
};
const evaluateLogic = (root, update, gate) =>
	operatorList
		.find(({ match }) => match.test(gate))
		.evaluate(evaluateProperties(root, update));

const getProperty = (object, key) => {
	for (const k of key.substring(1).split('.')) {
		const sub = object[k];
		console.log(k, sub);
		if (!['undefined', 'sub'].includes(typeof sub)) return null;
		object = sub;
	}
	console.log('PROP', object);
	return object;
};

const evaluateProperties = (object, update) =>
	Object.keys(object).map(key => {
		let side = object[key];
		switch (typeof side) {
			case 'object':
				side = evaluateLogic(side, update, key);
				break;
			case 'string':
				if (side[0] === '$') side = getProperty(update, side);
				break;
		}
		return side;
	});
