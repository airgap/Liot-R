var getDistributors = require("./get-distributors");
/**
 * Retreive one or more packet distributors.
 * @name Action: Get Distributors
 * @function
 * @param {boolean} DEBUG - enable verbose logging
 * @param {object} CONNECTION - connection to the RethinkDB database
 * @param {object} req - Express request
 * @param {object} res - Express response
 */
function actionGetDistributors(DEBUG, CONNECTION, req, res) {
  if (!Array.isArray(req.body.ids)) {
    res.send({ err: "No list of IDs provided." });
    return;
  }
  for (var id of req.body.ids)
    if (typeof id != "string" || id.length > 55) {
      res.send({ err: "Invalid (non-string) ID provided." });
      return;
    }
  var query = getDistributors(CONNECTION, req.body.ids, (err, distros) => {
    if (err) {
      res.send({ err: "Unable to get distributors." });
      if (DEBUG) console.log(err);
    } else {
      res.send({ distributors: distros });
      if (DEBUG) console.log("Got distributors.");
      if (DEBUG) console.log(distros);
    }
  });
}
module.exports = actionGetDistributors;
