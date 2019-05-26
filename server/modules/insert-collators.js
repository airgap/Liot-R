var r = require('rethinkdb')
module.exports = (CONNECTION, collators, callback) => {
  r.table('Collators').insert(collators, { conflict: 'replace' }).run(CONNECTION, callback)
}
