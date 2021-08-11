/**
 * Smart indexer that recognizes words like "abc12" to be less than "abc100"
 * @name Helper: Sortify
 * @function
 * @param {string} ids - text to build an index value for
 * @returns {number} - index value of the provided text
 */
function sortify(text) {
  var reg = /([A-Za-z]+|[0-9]+|.+?)/g;
  var score = 0;
  var regontxt = text.match(reg);
  if (regontxt) {
    for (var i = 0; i < regontxt.length; i++) {
      var match = regontxt[i];
      if (match.match(/^[A-Za-z]+$/)) {
        for (var l in match) score += match.charCodeAt(l);
      } else if (match.match(/^[0-9]+$/)) {
        score += match * 1;
      } else {
        for (var l in match) score += match.charCodeAt(l);
      }
    }
  }
  return score;
}
module.exports = sortify;
