import { Operator } from '../Operator';

export class And extends Operator {
	match = /^(AND|&&)$/i;
	minInputs = 1;
	maxInputs = Number.MAX_VALUE;
	evaluate = operands => operands.reduce((l, r) => l && r);
}
