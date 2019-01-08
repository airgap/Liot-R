/* THIS FUNCTION IS INCOMPLETE AND NOT READY FOR PRODUCTION */
function actionPushUpdates(req, res, dat) {
  if(!Array.isArray(dat.updates)) {
    res.send({err: 'No updates specified.'});
    return;
  }
  var toPush = [];
  var idsAndAccessors = [];
  var ids = [];

  for(var update of dat.updates) {
    var newUpdate = {};
    if(typeof dat.accessor != 'string') {
      res.send({err: 'No accessor specified.'});
      return;
    }
    var tv = typeof dat.value;
    if(tv == 'undefined' || tv == 'null') {
      res.send({err: 'No value specified.'});
      return;
    }
    newUpdate.accessor = dat.accessor;
    newUpdate.value = dat.value;
    idsAndAccessors.push({id:dat.id,accessor:dat.accessor});
  }
  var idsExpr = r.expr(idsAndAccessors);
  r.table('Collectors').filter(collector=>{
    //if(collector('accessor').eq())
  })
}
exports = actionPushUpdates;
