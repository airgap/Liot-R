import { Operator } from '../Operator';

export class Power extends Operator {
	match = /^(POWER|RAISE|^)$/i;
	minInputs = 1;
	maxInputs = Number.MAX_VALUE;
	evaluate = operands => operands.reduce((l, r) => Math.pow(l, r));
}
