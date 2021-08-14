import { Operator } from '../Operator';

export class UnderOrEqual extends Operator {
	match = /^((UNDER|LESS THAN) OR EQUAL TO|<=)$/i;
	minInputs = 2;
	maxInputs = Number.MAX_VALUE;
	evaluate = operands => {
		const first = operands[0];
		for (let o = 1; o < operands; o++) if (first > o) return false;
		return true;
	};
}
