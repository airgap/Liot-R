import { Operator } from '../Operator';

export class Over extends Operator {
	match = /^(OVER|<)$/i;
	minInputs = 2;
	maxInputs = Number.MAX_VALUE;
	evaluate = operands => {
		const first = operands[0];
		for (let o = 1; o < operands; o++) if (first <= o) return false;
		return true;
	};
}
