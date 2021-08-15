import { insertCollators } from '../insertCollators';
import { Action } from '../Action';

/**
 * Creates one or more filter collators.
 * @name Action: Add Collators
 * @function
 */
export class AddCollators extends Action {
	description = 'add collators';
	perform = async (params, r) => {
		const collators = [],
			tcol: any = {},
			filters = [];
		if (Array.isArray(params.collators))
			for (const collator of params.collators) {
				if (typeof collator.id === 'string') tcol.id = collator.id;
				if (typeof collator.name === 'string' && collator.name.length)
					tcol.name = collator.name;
				if (Array.isArray(collator.filters))
					for (const filter of collator.filters)
						if (
							typeof filter === 'string' &&
							filters.indexOf(filter) === -1
						)
							filters.push(filter);
				tcol.filters = filters;
				collators.push(tcol);
			}
		try {
			await insertCollators(r, collators);
		} catch (err) {
			console.error(err);
			return { err: 'Unable to create collators.' };
		}
		return {};
	};
}