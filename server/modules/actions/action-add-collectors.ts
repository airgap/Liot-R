import { sortify } from '../sortify';
import { insertCollectors } from '../insert-collectors';

/**
 * Creates one or more packet collectors.
 * @name Action: Add Collectors
 * @function
 */
export async function actionAddCollectors({ collectors }, r) {
	const sanitizedCollectors = [];
	const manufacturer_attributes = [
		'manufacture_req.bodye',
		'manufacturer',
		'model',
		'series'
	];
	if (!Array.isArray(collectors))
		return { err: '`collectors` must be an array' };
	for (const collector of collectors) {
		if (typeof collector !== 'object')
			return { err: 'All collectors must be valid objects' };
		const trec: any = {};
		if (typeof collector.device_info === 'object') {
			const device_info = collector.device_info;
			trec.device_info = {};
			for (const manufacturer_attribute of manufacturer_attributes)
				if (
					typeof device_info[manufacturer_attribute] === 'string' &&
					device_info[manufacturer_attribute].length < 100
				)
					trec.device_info[manufacturer_attribute] =
						device_info[manufacturer_attribute];
		}
		if (typeof collector.name === 'string' && collector.name.length < 100)
			trec.name = collector.name;
		trec.value = 0;
		trec.smart = sortify(collector.name || '');
		trec.aggregate = !!collector.aggregate;
		trec.accessor = r.uuid(); //rename collators to funnels?
		sanitizedCollectors.push(trec);
	}
	try {
		return await insertCollectors(r, sanitizedCollectors);
	} catch (err) {
		return { err: 'Could not create collectors.' };
	}
}
