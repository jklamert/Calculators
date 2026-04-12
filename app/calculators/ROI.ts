export interface ROIResult {
  roi: number;
  annualizedRoi?: number;
  netProfit: number;
}

/**
 * Return on Investment calculator.
 *
 * - ROI = ((revenue - cost) / cost) * 100
 * - Annualized ROI = ((revenue / cost)^(1/years) - 1) * 100
 *
 * @example
 * ```typescript
 * const roi = new ROI(10000, 15000, 3);
 * const result = roi.calculate();
 * result.roi;           // 50.00
 * result.annualizedRoi; // 14.47
 * result.netProfit;     // 5000.00
 * ```
 */
export default class ROI {
  cost: number;
  revenue: number;
  years?: number;

  /**
   * @param cost - Initial investment cost (must be > 0).
   * @param revenue - Total return received (>= 0).
   * @param years - Optional holding period for annualized ROI calculation (must be > 0 if provided).
   */
  constructor(cost: number, revenue: number, years?: number) {
    this.cost = cost;
    this.revenue = revenue;
    this.years = years;
  }

  /**
   * Validates that all inputs are within acceptable ranges.
   * @throws {Error} If any input is invalid.
   */
  _validate() {
    if (this.cost <= 0) {
      throw new Error("Cost must be greater than zero.");
    }
    if (this.revenue < 0) {
      throw new Error("Revenue must be zero or greater.");
    }
    if (this.years !== undefined && this.years <= 0) {
      throw new Error("Years must be greater than zero.");
    }
  }

  /**
   * Computes the ROI, net profit, and optionally the annualized ROI.
   * @returns An {@link ROIResult} with roi, netProfit, and optionally annualizedRoi.
   * @throws {Error} If any input is invalid.
   */
  calculate(): ROIResult {
    this._validate();

    const netProfit = Number.parseFloat((this.revenue - this.cost).toFixed(2));
    const roi = Number.parseFloat(((netProfit / this.cost) * 100).toFixed(2));

    const result: ROIResult = { roi, netProfit };

    if (this.years !== undefined) {
      const annualized =
        (Math.pow(this.revenue / this.cost, 1 / this.years) - 1) * 100;
      result.annualizedRoi = Number.parseFloat(annualized.toFixed(2));
    }

    return result;
  }
}
