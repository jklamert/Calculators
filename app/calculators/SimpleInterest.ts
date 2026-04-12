/**
 * Calculates simple interest using the formula A = P(1 + rt).
 *
 * @example
 * ```typescript
 * const si = new SimpleInterest(1000, 5, 3);
 * si.calculate(); // 1150.00
 * ```
 */
export default class SimpleInterest {
  principal = 0;
  rate = 0;
  years = 0;

  /**
   * @param principal - The initial amount invested or borrowed (must be > 0).
   * @param ratePercentage - Annual interest rate as a percentage, 0-100.
   * @param years - Time period in years (>= 0).
   */
  constructor(principal: number, ratePercentage: number, years: number) {
    this.principal = principal;
    this.rate = ratePercentage;
    this.years = years;
  }

  /**
   * Computes the total amount after applying simple interest.
   * @returns The total amount (principal + interest), rounded to 2 decimal places.
   * @throws {Error} If principal <= 0, rate is outside 0-100, or years < 0.
   */
  calculate(): number {
    if (this.principal <= 0) {
      throw new Error(
        "Simple Interest requires a principal greater than zero."
      );
    }
    if (this.rate < 0 || this.rate > 100) {
      throw new Error(
        "Simple Interest requires a rate between 0 and 100 percent."
      );
    }
    if (this.years < 0) {
      throw new Error("Simple Interest requires a time span >= 0.");
    }
    const rateAsDecimal = this.rate / 100;
    const result = this.principal * rateAsDecimal * this.years;

    return Number.parseFloat((this.principal + result).toFixed(2));
  }
}
