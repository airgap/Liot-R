import { Operator } from '../Operator';

export class Or extends Operator {
	match = /^(OR|\|\|)$/i;
	minInputs = 1;
	maxInputs = Number.MAX_VALUE;
	evaluate = operands => operands.reduce((l, r) => l || r);
}