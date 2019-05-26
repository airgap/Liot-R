var r = require('rethinkdb');
/**
 * Builds a query for counting the number of collators referencing the specified filters.
 * Useful for determining whether specified filters can be safely deleted.
 * @name Helper: Build Filter Reference Counter Query
 * @function
 * @param {array} ids - list of filter ids to run the query on
 * @returns {object} - RethinkDB query for retreiving the reference count
 */
function buildFilterReferenceCounterQuery(ids) {
  var query = r.table('Filters');
  if(Array.isArray(ids))
    query = query.filter(d=>{return r.expr(ids).contains(d('id'))});
  query = query.map(filt=>{return {id:filt('id'),refcount:r.table("Collators").group('id')('filters')(0).contains(filt('id')).ungroup()('reduction').filter(r=>{return r.eq(true)}).count()}})
  //query = query.filter(isReferencedFilter);
  return query;
}

/**
 * Builds a query for counting the number of distributors referencing the specified collators.
 * Useful for determining whether specific collators can be safely deleted as well as for building a list of unused filters.
 * @name Helper: Build Collator Reference Counter Query
 * @function
 * @param {array} ids - list of collator ids to run the query on
 * @returns {object} - RethinkDB query for retreiving the reference count
 */
function buildCollatorReferenceCounterQuery(ids) {
  var query = r.table('Collators');
  if(Array.isArray(ids))
    query = query.filter(d=>{
      return r.expr(ids).contains(d('id'))
    });
  query = query.map(filt=>{
    return {
      id:filt('id'),
      refcount:r.table("Distributors")
        .group('id')('collators')(0)
          .contains(filt('id'))
            .ungroup()('reduction')
              .filter(r=>{
                return r.eq(true)
              }).count()
    }
  })
  return query;
}

/**
 * Builds a query for retreiving a list of the collators referencing the specified filters.
 * Also includes other filters (siblings) referenced by the parent collators.
 * @name Helper: Build Filter Referrer Lister Query
 * @function
 * @param {array} ids - list of filter ids to run the query on
 * @returns {object} - RethinkDB query for retreiving the reference list
 */
function buildFilterReferrerListerQuery(ids) {
  var query = r.table('Filters');
  if(Array.isArray(ids))
    query = query.filter(d=>{return r.expr(ids).contains(d('id'))});
  query = query.map(filt=>{
    return {
      id:filt('id'),
      referrers:r.db('LiotR')
        .table("Collators")
            .filter(col=>{
              return col('filters')
                .contains(filt('id'))
              }).merge(doc=>{return {filtrets:r.table('Filters').getAll(r.args(doc('filters'))).coerceTo('array')}})
              .coerceTo('array')
    }
  })
  return query;
}

/**
 * Builds a query for retreiving a list of the distributors referencing the specified filters.
 * Incomplete, do not use.
 * @name Helper: Build Filter Referrer Referrer Lister Query
 * @function
 * @param {array} ids - list of filter ids to run the query on
 * @returns {object} - RethinkDB query for retreiving the reference list
 */
function buildFilterDistributorListerQuery(ids) {
  var query = r.table('Filters');
  if(Array.isArray(ids))
    query = query.filter(d=>{return r.expr(ids).contains(d('id'))});
  query = query.map(filt=>{
    return {
      id:filt('id'),
      referrers:r.db('LiotR')
        .table("Collators")
            .filter(col=>{
              return col('filters')
                .contains(filt('id'))
              }).merge(doc=>{return {filtrets:r.table('Filters').getAll(r.args(doc('filters'))).coerceTo('array')}})
              .coerceTo('array')
    }
  })
  return query;
}

module.exports = {
  buildFilterReferrerListerQuery: buildFilterReferrerListerQuery,
  buildFilterReferenceCounterQuery: buildFilterReferenceCounterQuery,
  buildFilterDistributorListerQuery: buildFilterDistributorListerQuery,
  buildCollatorReferenceCounterQuery: buildCollatorReferenceCounterQuery
}
