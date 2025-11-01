import { sum } from './sum';

describe('sum.ts', () => {
  it('should sum two numbers', () => {
    const num1 = 10;
    const num2 = 20;

    const result = sum(num1, num2);

    expect(result).toBe(30);
  });
});
