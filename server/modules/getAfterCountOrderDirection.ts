export const getAfterCountOrderDirection = (
	r,
	{ after, count, order, direction }
): [any, number, number, any] => [
	r,
	// after
	typeof after !== 'number' || after < 0 ? 0 : after,
	// count
	typeof count !== 'number' || count < 0 || count > 1000 ? 100 : count,
	// order & direction
	r[direction === 'descending' ? 'desc' : 'asc'](
		typeof order !== 'string' || !['smart', 'name', 'id'].includes(order)
			? 'smart'
			: order
	)
];
