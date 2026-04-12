/**
 * Calculates the present value of a future sum using PV = FV / (1 + r)^n.
 *
 * @example
 * ```typescript
 * const pv = new PresentValue(10000, 5, 10);
 * pv.calculate(); // 6139.13
 * ```
 */
export default class PresentValue {
  futureValue: number;
  rate: number;
  years: number;

  /**
   * @param futureValue - The future amount to discount (must be > 0).
   * @param ratePercentage - Annual discount rate as a percentage, 0-100.
   * @param years - Time period in years (must be > 0; fractional years allowed).
   */
  constructor(futureValue: number, ratePercentage: number, years: number) {
    this.futureValue = futureValue;
    this.rate = ratePercentage;
    this.years = years;
  }

  /**
   * Validates that all inputs are within acceptable ranges.
   * @throws {Error} If any input is invalid.
   */
  _validate() {
    if (this.futureValue <= 0) {
      throw new Error("Future value must be greater than zero.");
    }
    if (this.rate < 0 || this.rate > 100) {
      throw new Error("Rate must be between 0 and 100.");
    }
    if (this.years <= 0) {
      throw new Error("Years must be greater than zero.");
    }
  }

  /**
   * Computes the present value of the future sum.
   * @returns The present value, rounded to 2 decimal places.
   * @throws {Error} If any input is invalid.
   */
  calculate(): number {
    this._validate();

    if (this.rate === 0) {
      return this.futureValue;
    }

    const rateDecimal = this.rate / 100;
    const result = this.futureValue / Math.pow(1 + rateDecimal, this.years);
    return Number.parseFloat(result.toFixed(2));
  }
}
