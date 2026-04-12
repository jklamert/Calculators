export interface RuleOf72Result {
  estimatedYears: number;
  exactYears: number;
}

/**
 * Rule of 72: estimates the number of years to double an investment.
 *
 * - Estimated = 72 / rate
 * - Exact = ln(2) / ln(1 + rate/100)
 *
 * @example
 * ```typescript
 * const r72 = new RuleOf72(8);
 * const result = r72.calculate();
 * result.estimatedYears; // 9
 * result.exactYears;     // 9.01
 * ```
 */
export default class RuleOf72 {
  rate: number;

  /**
   * @param ratePercentage - Annual interest rate as a percentage (0 < rate <= 100).
   */
  constructor(ratePercentage: number) {
    this.rate = ratePercentage;
  }

  /**
   * Validates that all inputs are within acceptable ranges.
   * @throws {Error} If rate is <= 0 or > 100.
   */
  _validate() {
    if (this.rate <= 0 || this.rate > 100) {
      throw new Error("Rate must be greater than 0 and at most 100.");
    }
  }

  /**
   * Computes both the estimated (Rule of 72) and exact doubling time.
   * @returns A {@link RuleOf72Result} with estimatedYears and exactYears.
   * @throws {Error} If rate is invalid.
   */
  calculate(): RuleOf72Result {
    this._validate();

    const estimatedYears = Number.parseFloat((72 / this.rate).toFixed(2));
    const exactYears = Number.parseFloat(
      (Math.log(2) / Math.log(1 + this.rate / 100)).toFixed(2)
    );

    return { estimatedYears, exactYears };
  }
}
