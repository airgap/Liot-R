import { Collator, CollatorWithFilters } from './Collator';

export interface Distributor {
	id: string;
	name: string;
	push: boolean;
	queue: boolean;
	callback: boolean;
	url: string;
	collatorIds: string[];
	accessor: string;
}

export interface DistributorWithCollators<
	CollatorType = Collator | CollatorWithFilters
> extends Distributor {
	collators: CollatorType[];
}

export type NewDistributor = Omit<Distributor, 'id' | 'accessor'>;
