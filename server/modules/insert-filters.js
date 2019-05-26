var r = require('rethinkdb')

module.exports = (CONNECTION, filters, callback) => {
  r.table('Filters').insert(filters, { conflict: 'replace' }).run(CONNECTION, callback)
}
