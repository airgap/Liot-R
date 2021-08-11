var r = require("rethinkdb");
/**
 * Retreive one or more filter collators.
 * @name Database: Get Collators
 * @function
 * @param {object} CONNECTION - Connection to the RethinkDB database
 * @param {array} collators - List of collators to retrieve
 * @param {function} callback - Function(error, result) to execute upon success or error
 */
function getCollators(CONNECTION, collators, callback) {
  r.table("Collators")
    .filter((doc) => {
      return r.expr(collators).contains(doc("id"));
    })
    .merge((doc) => {
      return {
        filtrets: r
          .table("Filters")
          .getAll(r.args(doc("filters")))
          .coerceTo("array"),
      };
    })
    .coerceTo("array")
    .run(CONNECTION, callback);
}
module.exports = getCollators;
