export interface Collector {
	id: string;
	name: string;
	deviceInfo?: {
		manufacturer?: string;
		model?: string;
		series?: string;
	};
}
export type NewCollector = Omit<Collector, 'id'>;
