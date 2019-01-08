exports = (req, res, dat) => {
  if(!Array.isArray(dat.ids)) {
    res.send({err: "No list of IDs provided."});
    return;
  }
  for(var id of dat.ids)if(typeof id != 'string' || id.length > 55) { res.send({err: 'Invalid (non-string) ID provided.'}); return }
  var query = r.table('Filters')
    .filter(doc=>{return r.expr(dat.ids).contains(doc('id'))})
        .coerceTo('array')
          .run(CONNECTION, (err, collators) => {
            if(err) {
              res.send({err: 'Unable to query.'});
              if(DEBUG)console.log(err);
            } else {
              res.send({filters:collators});
              if(DEBUG)console.log('Queried filters.');
              if(DEBUG)console.log(collators);
            }
          })


}
