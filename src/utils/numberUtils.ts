export function max(numberOne: number, numberTwo: number) {
  return numberOne > numberTwo ? numberOne : numberTwo;
}

export function toKb(bytes: number) {
  return Math.round(bytes / 1000);
}
