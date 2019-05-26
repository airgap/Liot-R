var r = require('rethinkdb')
module.exports = (CONNECTION, collectors, callback) => {
  r.table('Collectors').insert(collectors, { conflict: 'replace' }).run(CONNECTION, callback);
}
