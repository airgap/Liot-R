import { Client } from '../../Client.js';
import { grab, setc } from '../../bonus.js';
import { Collector } from '../../../../types/Collector';
import { Anonymous } from '../../../../types/Anonymous';
const liotR = new Client();
const save = async () => {
	const collector: Anonymous<Collector> = {
		name: grab('collector-name').value,
		deviceInfo: {}
	};
	for (const t of 'manufacturer model series'.split(' ')) {
		collector.deviceInfo[t] = grab('collector-' + t).value;
	}
	await liotR.addCollectors([collector]);
	location.href = '/collectors';
};
