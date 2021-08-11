
/**
 * Delete one or more filter collators.
 * @name Database: Delete Collators
 * @function
 * @param {object} r - Connection to the RethinkDB database
 * @param {array} collators - List of collator IDs to delete
 */
export const deleteCollators = (r, collators) =>
  r.table('Collators')
    .filter(doc=>{return r.expr(collators).contains(doc('id'))})
      .delete();
