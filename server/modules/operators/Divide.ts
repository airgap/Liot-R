import { Operator } from '../Operator';

export class Divide extends Operator {
	match = /^(DIVIDE|\/)$/i;
	minInputs = 1;
	maxInputs = Number.MAX_VALUE;
	evaluate = operands => operands.reduce((l, r) => l / r);
}
