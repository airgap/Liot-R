var r = require("rethinkdb");
/**
 * Delete one or more packet filters.
 * @name Database: Delete Filters
 * @function
 * @param {object} CONNECTION - Connection to the RethinkDB database
 * @param {array} filters - List of filter IDs to delete
 * @param {function} callback - Function(error, result) to execute upon success or error
 */
function deleteFilters(CONNECTION, filters, callback) {
  r.table("Filters")
    .filter((doc) => {
      return r.expr(filters).contains(doc("id"));
    })
    .delete()
    .run(CONNECTION, callback);
}
module.exports = deleteFilters;
