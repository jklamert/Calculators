export interface DCAResult {
  totalShares: number;
  totalInvested: number;
  averageCostPerShare: number;
  currentValue: number;
  gainLoss: number;
}

/**
 * Dollar Cost Averaging calculator.
 * Given a fixed investment amount per period and a list of prices per period,
 * calculates total shares, average cost basis, and current value.
 *
 * @example
 * ```typescript
 * const dca = new DollarCostAveraging(500, [100, 80, 120, 90, 110]);
 * const result = dca.calculate();
 * result.totalShares;         // accumulated shares
 * result.averageCostPerShare; // effective cost basis
 * result.gainLoss;            // dollar gain or loss
 * ```
 */
export default class DollarCostAveraging {
  investmentAmount: number;
  prices: number[];

  /**
   * @param investmentAmount - Fixed dollar amount invested each period (must be > 0).
   * @param prices - Array of asset prices per period (all must be > 0, at least one required).
   */
  constructor(investmentAmount: number, prices: number[]) {
    this.investmentAmount = investmentAmount;
    this.prices = prices;
  }

  /**
   * Validates that all inputs are within acceptable ranges.
   * @throws {Error} If any input is invalid.
   */
  _validate() {
    if (this.investmentAmount <= 0) {
      throw new Error("Investment amount must be greater than zero.");
    }
    if (this.prices.length === 0) {
      throw new Error("At least one price period is required.");
    }
    if (this.prices.some((p) => p <= 0)) {
      throw new Error("All prices must be greater than zero.");
    }
  }

  /**
   * Simulates periodic fixed-amount investments and returns aggregated results.
   * @returns A {@link DCAResult} with totalShares, totalInvested, averageCostPerShare, currentValue, and gainLoss.
   * @throws {Error} If any input is invalid.
   */
  calculate(): DCAResult {
    this._validate();

    let totalShares = 0;
    for (const price of this.prices) {
      totalShares += this.investmentAmount / price;
    }
    totalShares = Number.parseFloat(totalShares.toFixed(2));

    const totalInvested = this.investmentAmount * this.prices.length;
    const averageCostPerShare = Number.parseFloat(
      (totalInvested / totalShares).toFixed(2)
    );

    const lastPrice = this.prices[this.prices.length - 1];
    const currentValue = Number.parseFloat((totalShares * lastPrice).toFixed(2));
    const gainLoss = Number.parseFloat((currentValue - totalInvested).toFixed(2));

    return {
      totalShares,
      totalInvested,
      averageCostPerShare,
      currentValue,
      gainLoss,
    };
  }
}
