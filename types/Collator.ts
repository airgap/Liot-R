export interface Collator {
	id: string;
	name: string;
	filters: string[];
}

export type NewCollator = Omit<Collator, 'id'>;
