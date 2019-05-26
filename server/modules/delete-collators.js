var r = require('rethinkdb')
/**
 *
 * @name Database: Delete Collators
 * @function
 * @param {object} CONNECTION - Connection to the RethinkDB database
 * @param {array} collators - List of collator IDs to delete
 * @param {function} callback - Function(error, result) to execute upon success or error
 */
function deleteCollators(CONNECTION, collators, callback) {
  r.table('Collators')
    .filter(doc=>{return r.expr(collators).contains(doc('id'))})
      .delete()
        .run(CONNECTION, callback)
}
module.exports = deleteCollators
