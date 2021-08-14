import { Operator } from '../Operator';

export class Not extends Operator {
	match = /^(NOT|!)$/i;
	minInputs = 1;
	maxInputs = 1;
	evaluate = operands => !operands[0];
}
