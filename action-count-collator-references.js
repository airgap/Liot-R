function actionCountCollatorReferences(req, res, dat) {
  query = buildCollatorReferenceCounterQuery(Array.isArray(dat.ids) ? dat.ids : null);
  query.coerceTo('array').run(CONNECTION, (err, collators) => {
    if(err) {
      res.send('Error counting collator references.');
      return;
    }
    res.send({collators:collators});
  })
}
exports = actionCountCollatorReferences;
