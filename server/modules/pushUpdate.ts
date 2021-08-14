import { sendDataToCallback } from './sendDataToCallback';
import { distributeUpdate } from './distributeUpdate';

export async function pushUpdate(newUpdate, r) {
	return await distributeUpdate(
		newUpdate.id
			? await pushAggregateUpdate(newUpdate, r)
			: await pushSingleUpdate(newUpdate, r),
		newUpdate,
		r
	);
}

export const pushSingleUpdate = (newUpdate, r) =>
	r
		.table('Collectors')
		.getAll(newUpdate.accessor, { index: 'accessor' })
		.update({ value: newUpdate.value }, { return_changes: 'always' });

export const pushAggregateUpdate = (newUpdate, r) =>
	// If the update accessor belongs to an aggregate collector,
	// then update whatever collector matches the update ID.
	// This allows the requester to update any collector
	// as long as they know the AC's accessor.
	r.branch(
		// If a valid aggregate collector exists...
		r
			.table('Collectors')
			.getAll(newUpdate.accessor, { index: 'accessor' })
			.filter({ aggregate: true })
			.limit(1)
			.count()
			.eq(1),
		// Then update the requested collector.
		r
			.table('Collectors')
			.get(newUpdate.id)
			.update({ value: newUpdate.value }, { return_changes: 'always' }),
		// Otherwise, don't.
		{ replaced: 0 }
	);
