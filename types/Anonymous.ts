export type Anonymous<T> = Omit<T, 'id'> & { id?: string };
