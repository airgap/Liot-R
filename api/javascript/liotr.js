if (typeof XMLHttpRequest === "undefined") {
  XMLHttpRequest = require("XMLHttpRequest");
}

function LiotR() {
  //var SERVER = "https://1.db.yup.place:4430";
  //var SESSION;
  //return self;
}

/**
 * The URL of the Liot R server to connect to.
 */
LiotR.SERVER = "http://localhost:7474"; //eye.lyku.org

/**
 * Session ID of the current login session. Currently unused.
 */
LiotR.SESSION = null;

/**
 * Post data to the Liot R server
 * @namespace API
 * @function post
 * @param {object} data - the JSON to send to the server. Should contain an action.
 * @param {function} callback - the function to call when the post completes or errors (response = {err: 'Description'}).
 * @returns {object} the XMLHttpRequest creating for the post.
 */
LiotR.post = (data, callback) => {
  var xml = new XMLHttpRequest();
  if (typeof callback == "function") {
    xml.addEventListener("load", () => {
      //alert(xml.response)
      callback(JSON.parse(xml.responseText));
    });
    xml.addEventListener("error", () => {
      callback({ err: "Unable to contact server." });
    });
  }

  if (LiotR.SESSION) data.sessionid = LiotR.SESSION;

  //alert(JSON.stringify(data))
  xml.open("POST", LiotR.SERVER);
  xml.setRequestHeader("Content-type", "application/json");
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

LiotR.addCollectors = (data, callback) => {
  data.action = "add collectors";
  return LiotR.post(data, callback);
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

LiotR.listCollectors = (data, callback) => {
  data.action = "list collectors";
  return LiotR.post(data, callback);
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

LiotR.getCollectors = (data, callback) => {
  data.action = "get collectors";
  return LiotR.post(data, callback);
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

LiotR.deleteCollectors = (data, callback) => {
  data.action = "delete collectors";
  return LiotR.post(data, callback);
};

LiotR.listFilters = (data, callback) => {
  data.action = "list filters";
  return LiotR.post(data, callback);
};

LiotR.addFilters = (data, callback) => {
  data.action = "add filters";
  return LiotR.post(data, callback);
};

LiotR.getFilters = (data, callback) => {
  data.action = "get filters";
  return LiotR.post(data, callback);
};

LiotR.deleteFilters = (data, callback) => {
  data.action = "delete filters";
  return LiotR.post(data, callback);
};

LiotR.countFilterReferences = (data, callback) => {
  data.action = "count filter references";
  return LiotR.post(data, callback);
};

LiotR.listFilterReferrers = (data, callback) => {
  data.action = "list filter referrers";
  return LiotR.post(data, callback);
};

LiotR.addCollators = (data, callback) => {
  data.action = "add collators";
  return LiotR.post(data, callback);
};

LiotR.listCollators = (data, callback) => {
  data.action = "list collators";
  return LiotR.post(data, callback);
};

LiotR.getCollators = (data, callback) => {
  data.action = "get collators";
  return LiotR.post(data, callback);
};

LiotR.deleteCollators = (data, callback) => {
  data.action = "delete collators";
  return LiotR.post(data, callback);
};

LiotR.countCollatorReferences = (data, callback) => {
  data.action = "count collator references";
  return LiotR.post(data, callback);
};

LiotR.addDistributors = (data, callback) => {
  data.action = "add distributors";
  return LiotR.post(data, callback);
};

LiotR.listDistributors = (data, callback) => {
  data.action = "list distributors";
  return LiotR.post(data, callback);
};

LiotR.getDistributors = (data, callback) => {
  data.action = "get distributors";
  return LiotR.post(data, callback);
};

LiotR.deleteDistributors = (data, callback) => {
  data.action = "delete distributors";
  return LiotR.post(data, callback);
};

LiotR.pushUpdate = (data, callback) => {
  data.action = "push update";
  return LiotR.post(data, callback);
};
