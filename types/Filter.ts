export interface Filter {
	id: string;
	name: string;
	code: string;
}

export type NewFilter = Omit<Filter, 'id'>;

export type FilterWithReferenceCount = Filter & { refcount: number };
