function actionListFilterDistributors(req, res, dat) {
  var query = buildFilterReferrerListerQuery(Array.isArray(dat.ids) ? dat.ids : null);
  query.coerceTo('array').run(CONNECTION, (err, filters) => {
    if(err) {
      res.send('Error listing filter referrers.');
      return;
    }
    res.send({filters:filters});
  })
}
exports = actionListFilterDistributors;
