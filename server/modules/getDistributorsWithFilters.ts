export const getDistributorsWithFilters = r =>
	r
		.table('Distributors')
		.without('name')
		.merge(doc => ({
			collators: r
				.table('Collators')
				.getAll(r.args(doc('collators')))
				.pluck('id', 'filters')
				.merge(doc => ({
					filters: r
						.table('Filters')
						.getAll(r.args(doc('filters')))
						.pluck('id', 'json', 'code')
						.coerceTo('array')
				}))
				.coerceTo('array')
		}));
