function actionModDistributors(req, res, dat) {
  if(Array.isArray(dat.distributors)) {
    var distributors = [];
    for(var distributor of dat.distributors) {
      var trans = {sources:[]}
      if(Array.isArray(distributor.sources)) {
        for(var source of distributor.sources) {
          trans.sources.push(source);
        }
      }
      distributors.push(trans);
    }
    r.table('Distributors').update(distributors).run(CONNECTION, (err, updated) => {
      if(err) {
        res.send({err:'Error updating distributors.'});
        if(DEBUG)console.log(err);
      } else {
        res.send({});
        if(DEBUG)console.log('Updated distributors.');
      }
    })
  }
}
exports = actionModDistributors;
