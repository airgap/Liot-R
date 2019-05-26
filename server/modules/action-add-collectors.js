var r = require('rethinkdb'),
  sortify = require('./sortify'),
  insertCollectors = require('./insert-collectors')
/**
 * Creates one or more packet collectors.
 * @name Action: Add Collectors
 * @function
 * @param {boolean} DEBUG - enable verbose logging
 * @param {object} CONNECTION - connection to the RethinkDB database
 * @param {object} req - Express request
 * @param {object} res - Express response
 * @param {object} dat - JSON data of the request
 */
module.exports = (DEBUG, CONNECTION, req, res, dat) => {
  var collectors = [];
  var manufacturer_attributes = ['manufacture_date', 'manufacturer', 'model', 'series'];
  if(Array.isArray(dat.collectors)) {
    for(var collector of dat.collectors) {
      if(typeof collector === 'object') {
        var trec = {};
        if(typeof collector.device_info === 'object') {
          var device_info = collector.device_info;
          trec.device_info = {};
          for(var manufacturer_attribute of manufacturer_attributes)
            if(typeof device_info[manufacturer_attribute] === 'string' && device_info[manufacturer_attribute].length < 100)
              trec.device_info[manufacturer_attribute] = device_info[manufacturer_attribute];
        }
        if(typeof collector.name === 'string' && collector.name.length < 100)
          trec.name = collector.name;
        trec.value = 0;
        trec.smart = sortify(collector.name || "");
        trec.aggregate = !!collector.aggregate
        trec.accessor = r.uuid();//rename collators to funnels?
        //trec.funnel = r.uuid();//rename collators to funnels?
        collectors.push(trec);
      }
    }
    insertCollectors(CONNECTION, collectors, (err, inserted) => {
      var obj = err ? {err: 'Could not create collectors.'} : {}
      res.send(obj)
    })
  }
}
