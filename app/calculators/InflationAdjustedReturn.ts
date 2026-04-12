export interface InflationAdjustedResult {
  realReturn: number;
  nominalRate: number;
  inflationRate: number;
}

/**
 * Calculates the real (inflation-adjusted) rate of return using the Fisher equation:
 * Real Return = ((1 + nominal) / (1 + inflation) - 1) * 100
 *
 * @example
 * ```typescript
 * const iar = new InflationAdjustedReturn(10, 3);
 * const result = iar.calculate();
 * result.realReturn; // 6.80
 * ```
 */
export default class InflationAdjustedReturn {
  nominalRate: number;
  inflationRate: number;

  /**
   * @param nominalRatePercentage - Nominal return rate as a percentage, 0-100.
   * @param inflationRatePercentage - Inflation rate as a percentage, 0 to <100.
   */
  constructor(nominalRatePercentage: number, inflationRatePercentage: number) {
    this.nominalRate = nominalRatePercentage;
    this.inflationRate = inflationRatePercentage;
  }

  /**
   * Validates that all inputs are within acceptable ranges.
   * @throws {Error} If any input is invalid.
   */
  _validate() {
    if (this.nominalRate < 0 || this.nominalRate > 100) {
      throw new Error("Nominal rate must be between 0 and 100.");
    }
    if (this.inflationRate < 0 || this.inflationRate >= 100) {
      throw new Error("Inflation rate must be at least 0 and less than 100.");
    }
  }

  /**
   * Computes the real rate of return after adjusting for inflation.
   * @returns An {@link InflationAdjustedResult} with realReturn, nominalRate, and inflationRate.
   * @throws {Error} If any input is invalid.
   */
  calculate(): InflationAdjustedResult {
    this._validate();

    const nominal = this.nominalRate / 100;
    const inflation = this.inflationRate / 100;

    const realReturn = Number.parseFloat(
      (((1 + nominal) / (1 + inflation) - 1) * 100).toFixed(2)
    );

    return {
      realReturn,
      nominalRate: this.nominalRate,
      inflationRate: this.inflationRate,
    };
  }
}
