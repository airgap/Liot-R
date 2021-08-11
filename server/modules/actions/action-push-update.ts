import { validUrl } from 'valid-url';
import { request } from 'express';

/**
 * Push an update to a collector.
 * Does not require admin access to perform; any client with a valid Accessor can push an update.
 * @name Action: Push Update
 * @function
 * @param {object} params - request params
 * @param {object} r - connection to the RethinkDB database
 */
export async function actionPushUpdate(params, r) {
	const newUpdate: any = {};
	if (typeof params.accessor !== 'string')
		return { err: 'No accessor specified.' };

	if (['undefined', 'null'].includes(typeof params.value))
		return { err: 'No value specified.' };
	if (typeof params.id === 'string') {
		newUpdate.id = params.id;
		return;
	}
	newUpdate.accessor = params.accessor;
	newUpdate.value = params.value;
	//idsAndAccessors.push({id:dat.id,accessor:dat.accessor});
	//var idsExpr = r.expr(idsAndAccessors);
	if (newUpdate.id) {
		return await updated(
			await r.branch(
				r
					.table('Collectors')
					.getAll(newUpdate.accessor, {
						index: 'accessor'
					})
					.filter({ aggregate: true })
					.limit(1)
					.count()
					.eq(1),
				r
					.table('Collectors')
					.get(newUpdate.id)
					.update(
						{ value: newUpdate.value },
						{ return_changes: 'always' }
					),
				{ replaced: 0 }
			)
		);
		/*r.table('Collectors')
          .getAll(newUpdate.accessor,{index:"accessor"})
            .filter({aggregate:true})
              .count()
                .run(CONNECTION, (err, count) => {
                  if(DEBUG)console.log(count);
                  if(count) {
                    updateDocument();
                  }
        })*/
	} else {
		return await updated(
			await r
				.table('Collectors')
				.getAll(newUpdate.accessor, {
					index: 'accessor'
				})
				.update(
					{ value: newUpdate.value },
					{ return_changes: 'always' }
				)
		);
		/*r.table('Collectors')
          .getAll(newUpdate.accessor,{index:"accessor"})
            .map({changes:[{new_val:r.row()}]})*/
	}

	async function updated(updated) {
		if (
			updated &&
			typeof updated.changes[0].new_val == 'object'
		) {
			var nv = updated.changes[0].new_val;
			const rows = await r
				.table('Distributors')
				.without('name')
				.merge(doc => ({
					collators: r
						.table('Collators')
						.getAll(r.args(doc('collators')))
						.pluck('id', 'filters')
						.merge(doc => ({
							filters: r
								.table('Filters')
								.getAll(
									r.args(doc('filters'))
								)
								.pluck('id', 'json', 'code')
								.coerceTo('array')
						}))
						.coerceTo('array')
				}));
			//if(DEBUG)console.log(err || rows)
			const filters = {};
			const distributedData = [];
			for (const distributor of rows)
				for (const collator of distributor.collators)
					for (const filter of collator.filters)
						if (
							!filters.hasOwnProperty(
								filter.id
							)
						)
							filters[filter.id] =
								filter.json;
			console.log(filters);
			const keys = Object.keys(filters);
			for (const k of keys)
				if (recur(filters[k], nv, 'ROOT')) {
					filters[k] = true;
				}
			for (const distributor of rows)
				for (const collator of distributor.collators) {
					let pass = false;
					for (const filter of collator.filters)
						if (filters[filter.id]) {
							const data = JSON.parse(
								JSON.stringify(newUpdate)
							);
							if (distributor.accessor) {
								data.accessor =
									distributor.accessor;
							}
							if (
								distributor.push &&
								!distributor.queue
							)
								data.id = r.uuid(
									data.id +
										' ' +
										distributor.id
								);
							data.distributor =
								distributor.id;
							//dostributors.push({id:distributor.id,accessor:distributor.accessor})
							distributedData.push(data);
							if (
								distributor.callback &&
								validUrl.isUri(
									distributor.url
								)
							) {
								sendDataToCallback(
									data,
									distributor.url
								);
							} else if (distributor.push) {
								try {
									const inserted = await r
										.table(
											'DistributedData'
										)
										.insert(
											distributedData
										);
									console.log(
										'inserted',
										inserted
									);
								} catch (err) {
									console.error(err);
								}
							}
							pass = true;
							break;
						}
					if (pass) break;
				}
			console.log('PASS');
			return {};
		}
	}

	/*r.table('Collectors').filter(collector=>{
      //if(collector('accessor').eq())
    })*/
}

async function sendDataToCallback(data, url) {
	if (!url.match(/^[A-Za-z]+:\/\//))
		url = 'http://' + url;
	await request.post({
		headers: { 'content-type': 'application/json' },
		url: url,
		body: data,
		json: true
	});
}

function recur(root, update, gate) {
	//if(DEBUG)console.log(gate)
	const left = evaluateProperty(root, update, 0),
		right = evaluateProperty(root, update, 1);
	let res = false;
	switch (gate) {
		case 'ROOT':
			res = !!left;
			break;
		case 'AND':
			res = left && right;
			break;
		case 'OR':
			res = left || right;
			break;
		case 'NAND':
			res = !(left && right);
			break;
		case 'NOR':
			res = !(left || right);
			break;
		case 'XOR':
			res = (left || right) && !(left && right);
			break;

		case 'UNDER':
			res = left < right;
			break;
		case 'OVER':
			res = left > right;
			break;
		case 'EQUALS':
			res = left == right;
			break;
		case 'TFEQUALS':
			res = left === right;
			break;
		case 'NEQUALS':
			res = left != right;
			break;
		case 'TFNEQUALS':
			res = left !== right;
			break;
		case 'OVEROR':
			res = left >= right;
			break;
		case 'UNDEROR':
			res = left <= right;
			break;
	}
	console.log(root, left, right, gate, res);
	return res;
}

function getProperty(object, key) {
	for (const k of key.substring(1).split('.')) {
		const sub = object[k];
		console.log(k, sub);
		if (['undefined', 'sub'].includes(typeof sub))
			object = sub;
		else return null;
	}
	console.log('PROP', object);
	return object;
}

function evaluateProperty(object, update, child) {
	const keys = Object.keys(object);
	const key = keys[child];
	let side = object[key];
	switch (typeof side) {
		case 'object':
			side = recur(side, update, key);
			break;
		case 'string':
			if (side[0] === '$')
				side = getProperty(update, side);
			break;
	}
	return side;
}
