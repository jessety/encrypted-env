// Basic math functions

export function add(...numbers: number[]): number {
  return numbers.reduce((accumulator, currentValue) => accumulator + currentValue);
}

export function multiply(...numbers: number[]): number {
  return numbers.reduce((accumulator, currentValue) => accumulator * currentValue);
}

export function square(aNumber: number): number {
  return aNumber * aNumber;
}
