var r = require('rethinkdb')

module.exports = (CONNECTION, distributors, callback) => {
  r.table('Distributors').insert(distributors, { conflict: 'replace' }).run(CONNECTION, callback)
}
