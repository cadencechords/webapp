export function max(numberOne, numberTwo) {
	return numberOne > numberTwo ? numberOne : numberTwo;
}

export function toKb(bytes) {
	return Math.round(bytes / 1000);
}
