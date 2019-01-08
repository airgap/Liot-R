exports = (req, res, dat) => {
  if(Array.isArray(dat.distributors)) {
    var distributors = [];
    for(var distributor of dat.distributors) {
      var trans = {collators:[]}
      if(typeof distributor.id === "string") {
        trans.id = distributor.id;
      }
      if(Array.isArray(distributor.collators)) {
        for(var collator of distributor.collators) {
          trans.collators.push(collator);
        }
      }
      if(typeof distributor.url === 'string' && validUrl.isUri(distributor.url)) {
        trans.url = distributor.url;
      }
      if(typeof distributor.name === 'string' && distributor.name.length > 0) {
        trans.name = distributor.name;
      }
      trans.push = !!distributor.push;
      trans.queue = !!distributor.queue;
      trans.callback = !!distributor.callback;
      distributors.push(trans);
    }
    r.table('Distributors').insert(distributors, { conflict: 'replace' }).run(CONNECTION, (err, created) => {
      if(err) {
        res.send({err:'Error creating distributors.'});
        if(DEBUG)console.log(err);
      } else {
        res.send({});
        if(DEBUG)console.log('Created distributors.');
      }
    })
  }
}
