export abstract class Action {
	static description: string;
	static perform: (
		params: any,
		r: any
	) => Promise<{ [key: string]: unknown }>;
	static public: boolean = false;
}
