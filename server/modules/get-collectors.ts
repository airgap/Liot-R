/**
 * Retreive one or more packet collectors.
 * @name Database: Get Collectors
 * @function
 * @param {object} r - Connection to the RethinkDB database
 * @param {array} collectors - List of collectors to retrieve
 */
export const getCollectors = async (r, collectors) =>
  r.table('Collectors')
    .filter(doc=>{return r.expr(collectors).contains(doc('id'))});
