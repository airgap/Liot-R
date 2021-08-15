"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiotR = void 0;
// just `npm i XMLHttpRequest` if you're running this in Node.js
if (typeof XMLHttpRequest === 'undefined') {
    XMLHttpRequest = require('XMLHttpRequest');
}
class LiotR {
    /**
     * The URL of the Liot R server to connect to.
     */
    SERVER = 'http://localhost:7474'; //eye.lyku.org
    /**
     * Session ID of the current login session. Currently unused.
     */
    SESSION = null;
    /**
     * Post data to the Liot R server
     * @namespace API
     * @function post
     * @param {object} data - the JSON to send to the server. Should contain an action.
     * @param {function} callback - the function to call when the post completes or errors (response = {err: 'Description'}).
     * @returns {object} the XMLHttpRequest creating for the post.
     */
    post = (data, callback) => {
        const xml = new XMLHttpRequest();
        if (typeof callback == 'function') {
            xml.addEventListener('load', () => {
                //alert(xml.response)
                callback(JSON.parse(xml.responseText));
            });
            xml.addEventListener('error', () => {
                callback({ err: 'Unable to contact server.' });
            });
        }
        if (this.SESSION)
            data.sessionid = this.SESSION;
        //alert(JSON.stringify(data))
        xml.open('POST', this.SERVER);
        xml.setRequestHeader('Content-type', 'application/json');
        xml.send(JSON.stringify(data));
        return xml;
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
    addCollectors = (data, callback) => {
        data.action = 'add collectors';
        return this.post(data, callback);
    };
    /**
     * Lists any packet collectors.
     * @namespace API
     * @function listCollectors
     * @param {object} data - The parameters of the query
     * @param {number} [data.after = 0] - Skip this many collectors. Default 0.
     * @param {number} [data.count = 100] - Return up to this many collectors. Default 100.
     * @param {function} callback - The function to call when the post completes or errors.
     * @returns {object} The XMLHttpRequest creating for the post.
     */
    listCollectors = (data, callback) => {
        data.action = 'list collectors';
        return this.post(data, callback);
    };
    /**
     * Retreives specified packet collectors.
     * @namespace API
     * @function getCollectors
     * @param {object} data - The parameters of the query
     * @param {array} data.ids - List of string IDs.
     * @param {function} callback - The function to call when the post completes or errors.
     * @returns {object} The XMLHttpRequest creating for the post.
     */
    getCollectors = (data, callback) => {
        data.action = 'get collectors';
        return this.post(data, callback);
    };
    /**
     * Lists any packet collectors.
     * @namespace API
     * @function deleteCollectors
     * @param {object} data - The parameters of the query
     * @param {number} [data.after = 0] - Skip this many collectors. Default 0.
     * @param {number} [data.count = 100] - Return up to this many collectors. Default 100.
     * @param {function} callback - The function to call when the post completes or errors.
     * @returns {object} The XMLHttpRequest creating for the post.
     */
    deleteCollectors = (data, callback) => {
        data.action = 'delete collectors';
        return this.post(data, callback);
    };
    listFilters = (data, callback) => {
        data.action = 'list filters';
        return this.post(data, callback);
    };
    addFilters = (data, callback) => {
        data.action = 'add filters';
        return this.post(data, callback);
    };
    getFilters = (data, callback) => {
        data.action = 'get filters';
        return this.post(data, callback);
    };
    deleteFilters = (data, callback) => {
        data.action = 'delete filters';
        return this.post(data, callback);
    };
    countFilterReferences = (data, callback) => {
        data.action = 'count filter references';
        return this.post(data, callback);
    };
    listFilterReferrers = (data, callback) => {
        data.action = 'list filter referrers';
        return this.post(data, callback);
    };
    addCollators = (data, callback) => {
        data.action = 'add collators';
        return this.post(data, callback);
    };
    listCollators = (data, callback) => {
        data.action = 'list collators';
        return this.post(data, callback);
    };
    getCollators = (data, callback) => {
        data.action = 'get collators';
        return this.post(data, callback);
    };
    deleteCollators = (data, callback) => {
        data.action = 'delete collators';
        return this.post(data, callback);
    };
    countCollatorReferences = (data, callback) => {
        data.action = 'count collator references';
        return this.post(data, callback);
    };
    addDistributors = (data, callback) => {
        data.action = 'add distributors';
        return this.post(data, callback);
    };
    listDistributors = (data, callback) => {
        data.action = 'list distributors';
        return this.post(data, callback);
    };
    getDistributors = (data, callback) => {
        data.action = 'get distributors';
        return this.post(data, callback);
    };
    deleteDistributors = (data, callback) => {
        data.action = 'delete distributors';
        return this.post(data, callback);
    };
    pushUpdate = (data, callback) => {
        data.action = 'push update';
        return this.post(data, callback);
    };
}
exports.LiotR = LiotR;
