var r = require('rethinkdb')
/**
 * Retreive one or more packet collectors.
 * @name Database: Get Collectors
 * @function
 * @param {object} CONNECTION - Connection to the RethinkDB database
 * @param {array} collectors - List of collectors to retrieve
 * @param {function} callback - Function(error, result) to execute upon success or error
 */
function getCollectors(CONNECTION, collectors, callback) {
  r.table('Collectors')
    .filter(doc=>{return r.expr(collectors).contains(doc('id'))})
      .coerceTo('array')
        .run(CONNECTION, callback)
}
module.exports = getCollectors
