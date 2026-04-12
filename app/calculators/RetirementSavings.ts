export interface RetirementResult {
  futureValue: number;
  totalContributions: number;
  totalInterest: number;
}

/**
 * Calculates the future value of retirement savings given an initial balance,
 * monthly contributions, annual rate, and number of years.
 *
 * FV = PV(1+r)^n + PMT * [((1+r)^n - 1) / r]
 * where r = monthly rate, n = total months.
 *
 * @example
 * ```typescript
 * const rs = new RetirementSavings(10000, 500, 7, 30);
 * const result = rs.calculate();
 * result.futureValue;        // projected total
 * result.totalContributions; // sum of monthly contributions
 * result.totalInterest;      // growth from interest
 * ```
 */
export default class RetirementSavings {
  initialBalance: number;
  monthlyContribution: number;
  rate: number;
  years: number;

  /**
   * @param initialBalance - Starting balance (>= 0).
   * @param monthlyContribution - Monthly contribution amount (>= 0).
   * @param ratePercentage - Annual return rate as a percentage, 0-100.
   * @param years - Investment horizon in years (must be > 0).
   */
  constructor(
    initialBalance: number,
    monthlyContribution: number,
    ratePercentage: number,
    years: number
  ) {
    this.initialBalance = initialBalance;
    this.monthlyContribution = monthlyContribution;
    this.rate = ratePercentage;
    this.years = years;
  }

  /**
   * Validates that all inputs are within acceptable ranges.
   * @throws {Error} If any input is invalid.
   */
  _validate() {
    if (this.initialBalance < 0) {
      throw new Error("Initial balance must be zero or greater.");
    }
    if (this.monthlyContribution < 0) {
      throw new Error("Monthly contribution must be zero or greater.");
    }
    if (this.rate < 0 || this.rate > 100) {
      throw new Error("Rate must be between 0 and 100.");
    }
    if (this.years <= 0) {
      throw new Error("Years must be greater than zero.");
    }
  }

  /**
   * Computes the projected future value of retirement savings.
   * @returns A {@link RetirementResult} with futureValue, totalContributions, and totalInterest.
   * @throws {Error} If any input is invalid.
   */
  calculate(): RetirementResult {
    this._validate();

    const totalMonths = this.years * 12;
    const totalContributions = this.monthlyContribution * totalMonths;

    if (this.rate === 0) {
      const futureValue = this.initialBalance + totalContributions;
      return {
        futureValue: Number.parseFloat(futureValue.toFixed(2)),
        totalContributions,
        totalInterest: 0,
      };
    }

    const monthlyRate = this.rate / 100 / 12;
    const factor = Math.pow(1 + monthlyRate, totalMonths);

    // FV of lump sum + FV of annuity
    const fvLumpSum = this.initialBalance * factor;
    const fvAnnuity = this.monthlyContribution * ((factor - 1) / monthlyRate);

    const futureValue = Number.parseFloat((fvLumpSum + fvAnnuity).toFixed(2));
    const totalInterest = Number.parseFloat(
      (futureValue - this.initialBalance - totalContributions).toFixed(2)
    );

    return {
      futureValue,
      totalContributions,
      totalInterest,
    };
  }
}
