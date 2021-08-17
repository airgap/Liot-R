import { Filter } from './Filter';

export interface Collator<FilterType = Filter | undefined> {
	id: string;
	name: string;
	filterIds: string[];
	filters: FilterType[];
}

export type NewCollator = Omit<Collator, 'id'>;

//export type CollatorWithFilters = Collator & { filters: Filter[] };
