export interface BreakEvenResult {
  breakEvenUnits: number;
  breakEvenRevenue: number;
  contributionMargin: number;
  contributionMarginRatio: number;
}

/**
 * Break-even calculator.
 * Break-even units = Fixed Costs / (Price per unit - Variable cost per unit).
 * Uses Math.ceil to round up to whole units.
 *
 * @example
 * ```typescript
 * const be = new BreakEven(50000, 100, 60);
 * const result = be.calculate();
 * result.breakEvenUnits;         // 1250
 * result.breakEvenRevenue;       // 125000
 * result.contributionMargin;     // 40
 * result.contributionMarginRatio; // 40 (percent)
 * ```
 */
export default class BreakEven {
  fixedCosts: number;
  pricePerUnit: number;
  variableCostPerUnit: number;

  /**
   * @param fixedCosts - Total fixed costs (must be > 0).
   * @param pricePerUnit - Selling price per unit (must be > 0).
   * @param variableCostPerUnit - Variable cost per unit (>= 0, must be less than pricePerUnit).
   */
  constructor(
    fixedCosts: number,
    pricePerUnit: number,
    variableCostPerUnit: number
  ) {
    this.fixedCosts = fixedCosts;
    this.pricePerUnit = pricePerUnit;
    this.variableCostPerUnit = variableCostPerUnit;
  }

  /**
   * Validates that all inputs are within acceptable ranges.
   * @throws {Error} If any input is invalid.
   */
  _validate() {
    if (this.fixedCosts <= 0) {
      throw new Error("Fixed costs must be greater than zero.");
    }
    if (this.pricePerUnit <= 0) {
      throw new Error("Price per unit must be greater than zero.");
    }
    if (this.variableCostPerUnit < 0) {
      throw new Error("Variable cost per unit must be zero or greater.");
    }
    if (this.variableCostPerUnit >= this.pricePerUnit) {
      throw new Error(
        "Variable cost per unit must be less than price per unit."
      );
    }
  }

  /**
   * Computes the break-even point in units and revenue.
   * @returns A {@link BreakEvenResult} with breakEvenUnits, breakEvenRevenue, contributionMargin, and contributionMarginRatio.
   * @throws {Error} If any input is invalid.
   */
  calculate(): BreakEvenResult {
    this._validate();

    const contributionMargin = Number.parseFloat(
      (this.pricePerUnit - this.variableCostPerUnit).toFixed(2)
    );

    const breakEvenUnits = Math.ceil(this.fixedCosts / contributionMargin);
    const breakEvenRevenue = Number.parseFloat(
      (breakEvenUnits * this.pricePerUnit).toFixed(2)
    );

    const contributionMarginRatio = Number.parseFloat(
      ((contributionMargin / this.pricePerUnit) * 100).toFixed(2)
    );

    return {
      breakEvenUnits,
      breakEvenRevenue,
      contributionMargin,
      contributionMarginRatio,
    };
  }
}
