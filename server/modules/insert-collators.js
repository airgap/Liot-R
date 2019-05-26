var r = require('rethinkdb')
function insertCollators(CONNECTION, collators, callback) {
  r.table('Collators').insert(collators, { conflict: 'replace' }).run(CONNECTION, callback)
}
module.exports = insertCollators
