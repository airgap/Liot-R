// just `npm i XMLHttpRequest` if you're running this in Node.js
if (typeof XMLHttpRequest === 'undefined') {
	XMLHttpRequest = require('XMLHttpRequest');
}

export class LiotRClient {
	/**
	 * The URL of the Liot R server to connect to.
	 */
	SERVER = 'http://localhost:7474'; //eye.lyku.org

	/**
	 * Session ID of the current login session. Currently unused.
	 */
	SESSION;

	/**
	 * Post data to the Liot R server
	 * @namespace API
	 * @function post
	 * @param {string} action - the server action to perform.
	 * @param {object} data - the JSON to send to the server.
	 * @returns {object} the server response, e.g. {err: 'Description'}.
	 */
	post = async (action: string, data: any) => {
		const res = await (
			await fetch(`${this.SERVER}/${action}`, {
				method: 'POST',
				body: JSON.stringify({ ...data, sessionid: this.SESSION })
			})
		).json();
		if (res.err) throw res.err;
		return res;
	};

	/**
	 * Creates one or more packet collectors.
	 * @namespace API
	 * @function addCollectors
	 * @param {object} data - the parameters of the query
	 * @param {array} data.filters - the details of the filters to insert
	 * @param {function} callback - the function to call when the post completes or errors.
	 * @returns {object} the XMLHttpRequest creating for the post.
	 */

	addCollectors = data => this.post('addCollectors', data);

	/**
	 * Lists any packet collectors.
	 * @namespace API
	 * @function listCollectors
	 * @param {object} data - The parameters of the query
	 * @param {number} [data.after = 0] - Skip this many collectors. Default 0.
	 * @param {number} [data.count = 100] - Return up to this many collectors. Default 100.
	 * @returns {object} The server response
	 */

	listCollectors = data => this.post('listCollectors', data);

	/**
	 * Retreives specified packet collectors.
	 * @namespace API
	 * @function getCollectors
	 * @param {object} data - The parameters of the query
	 * @param {array} data.ids - List of string IDs.
	 * @param {function} callback - The function to call when the post completes or errors.
	 * @returns {object} The XMLHttpRequest creating for the post.
	 */

	getCollectors = data => this.post('getCollectors', data);

	/**
	 * Lists any packet collectors.
	 * @namespace API
	 * @function deleteCollectors
	 * @param {object} data - The parameters of the query
	 * @param {number} [data.after = 0] - Skip this many collectors. Default 0.
	 * @param {number} [data.count = 100] - Return up to this many collectors. Default 100.
	 * @returns {object} The deleted collectors.
	 */
	deleteCollectors = (ids: string[]) =>
		this.post('deleteCollectors', { ids });

	listFilters = data => this.post('listFilters', data);

	addFilters = data => this.post('addFilters', data);

	getFilters = (ids: string[]) => this.post('getFilters', { ids });

	deleteFilters = (ids: string[]) => this.post('deleteFilters', { ids });

	countFilterReferences = (ids: string[]) =>
		this.post('countFilterReferences', { ids });

	listFilterReferrers = data => this.post('listFilterReferrers', data);

	addCollators = (collators: any[]) => this.post('addCollators', collators);

	addCollator = collator => this.addCollators([collator]);

	listCollators = data => this.post('listCollators', data);

	getCollators = (ids: string[]) => this.post('getCollators', { ids });

	getCollator = (id: string) => this.getCollators([id]);

	deleteCollators = (ids: string[]) => this.post('deleteCollators', { ids });

	countCollatorReferences = (ids: any[]) =>
		this.post('countCollatorReferences', { ids });

	addDistributors = data => this.post('addDistributors', data);

	listDistributors = data => this.post('listDistributors', data);

	getDistributors = (ids: string[]) => this.post('getDistributors', { ids });

	deleteDistributors = (ids: string[]) =>
		this.post('deleteDistributors', { ids });

	pushUpdate = data => this.post('pushUpdate', data);
}
