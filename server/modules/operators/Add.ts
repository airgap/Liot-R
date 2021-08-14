import { Operator } from '../Operator';

export class Add extends Operator {
	match = /^(ADD|\+)$/i;
	minInputs = 1;
	maxInputs = Number.MAX_VALUE;
	public evaluate = operands => operands.reduce((l, r) => l + r);
}
