export interface Distributor {
	id: string;
	name: string;
	push: boolean;
	queue: boolean;
	callback: boolean;
	url: string;
	collators: string[];
	accessor: string;
}

export type NewDistributor = Omit<Distributor, 'id' | 'accessor'>;
