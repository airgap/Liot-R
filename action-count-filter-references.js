function actionCountFilterReferences(req, res, dat) {
  query = buildFilterReferenceCounterQuery(Array.isArray(dat.ids) ? dat.ids : null);
  query.coerceTo('array').run(CONNECTION, (err, filters) => {
    if(err) {
      res.send('Error counting filter references.');
      return;
    }
    res.send({filters:filters});
  })
}
exports = actionCountFilterReferences;
