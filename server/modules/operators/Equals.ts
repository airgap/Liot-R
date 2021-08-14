import { Operator } from '../Operator';

export class Equals extends Operator {
	match = /^(EQUALS?|==)$/i;
	minInputs = 2;
	maxInputs = Number.MAX_VALUE;
	evaluate = operands => {
		const first = operands[0];
		for (let o = 1; o < operands; o++) if (first != o) return false;
		return true;
	};
}
