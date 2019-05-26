var r = require('rethinkdb')
function insertCollectors(CONNECTION, collectors, callback) {
  r.table('Collectors').insert(collectors, { conflict: 'replace' }).run(CONNECTION, callback);
}
module.exports = insertCollectors
