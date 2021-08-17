import { Collator, CollatorWithFilters } from './Collator';

export interface Distributor<
	CollatorType = Collator | CollatorWithFilters | undefined
> {
	id: string;
	name: string;
	push: boolean;
	queue: boolean;
	callback: boolean;
	url: string;
	collatorIds: string[];
	accessor: string;
	collators: CollatorType[];
}

export type NewDistributor = Omit<Distributor, 'id' | 'accessor'>;
