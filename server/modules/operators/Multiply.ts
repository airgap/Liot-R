import { Operator } from '../Operator';

export class Multiply extends Operator {
	match = /^(MULTIPLY|\*|•)$/i;
	minInputs = 1;
	maxInputs = Number.MAX_VALUE;
	evaluate = operands => operands.reduce((l, r) => l - r);
}
