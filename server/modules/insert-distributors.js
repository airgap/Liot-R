var r = require('rethinkdb')

function insertDistributors(CONNECTION, distributors, callback) {
  r.table('Distributors').insert(distributors, { conflict: 'replace' }).run(CONNECTION, callback)
}
module.exports = insertDistributors
