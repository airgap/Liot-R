import { Filter } from './Filter';

export interface Collator {
	id: string;
	name: string;
	filterIds: string[];
}

export interface CollatorWithFilters extends Collator {
	filters: Filter[];
}

export type NewCollator = Omit<Collator, 'id'>;

//export type CollatorWithFilters = Collator & { filters: Filter[] };
