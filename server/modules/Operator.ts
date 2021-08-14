export abstract class Operator {
	static match: RegExp = /^$/;
	static minInputs: number = 2;
	static maxInputs: number = 2;
	static evaluate: (operands: unknown[]) => unknown = () => null;
}
