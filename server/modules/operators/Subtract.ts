import { Operator } from '../Operator';

export class Subtract extends Operator {
	match = /^(SUBTRACT|-)$/i;
	minInputs = 1;
	maxInputs = Number.MAX_VALUE;
	evaluate = operands => operands.reduce((l, r) => l - r);
}
