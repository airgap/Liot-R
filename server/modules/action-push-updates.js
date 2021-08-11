/* THIS FUNCTION IS INCOMPLETE AND NOT READY FOR PRODUCTION */
/**
 * Push multiple update simultaneously for batch processing. Currently not fully implemented.
 * @name Action: Push Updates
 * @function
 * @param {boolean} DEBUG - enable verbose logging
 * @param {object} CONNECTION - connection to the RethinkDB database
 * @param {object} req - Express request
 * @param {object} res - Express response
 */
function actionPushUpdates(DEBUG, CONNECTION, req, res) {
  var dat = req.body;
  if (!Array.isArray(dat.updates)) {
    res.send({ err: "No updates specified." });
    return;
  }
  var toPush = [];
  var idsAndAccessors = [];
  var ids = [];

  for (var update of dat.updates) {
    var newUpdate = {};
    if (typeof dat.accessor != "string") {
      res.send({ err: "No accessor specified." });
      return;
    }
    var tv = typeof dat.value;
    if (tv == "undefined" || tv == "null") {
      res.send({ err: "No value specified." });
      return;
    }
    newUpdate.accessor = dat.accessor;
    newUpdate.value = dat.value;
    idsAndAccessors.push({ id: dat.id, accessor: dat.accessor });
  }
  var idsExpr = r.expr(idsAndAccessors);
  r.table("Collectors").filter((collector) => {
    //if(collector('accessor').eq())
  });
}
module.exports = actionPushUpdates;
