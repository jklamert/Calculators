export interface SavingsGoalResult {
  monthlySavings: number;
  totalContributions: number;
  interestEarned: number;
}

/**
 * Calculates the monthly savings needed to reach a financial goal.
 *
 * If rate > 0, uses the future value of annuity formula:
 *   PMT = (goalAmount - currentSavings * (1+r)^n) * r / ((1+r)^n - 1)
 *
 * If rate = 0:
 *   PMT = (goalAmount - currentSavings) / totalMonths
 *
 * @example
 * ```typescript
 * const sg = new SavingsGoal(50000, 10000, 6, 10);
 * const result = sg.calculate();
 * result.monthlySavings;     // required monthly amount
 * result.totalContributions; // total saved over time
 * result.interestEarned;     // growth from interest
 * ```
 */
export default class SavingsGoal {
  goalAmount: number;
  currentSavings: number;
  rate: number;
  years: number;

  /**
   * @param goalAmount - Target savings amount (must be > 0).
   * @param currentSavings - Current savings balance (>= 0, must be less than goalAmount).
   * @param ratePercentage - Annual return rate as a percentage, 0-100.
   * @param years - Time horizon in years (must be > 0).
   */
  constructor(
    goalAmount: number,
    currentSavings: number,
    ratePercentage: number,
    years: number
  ) {
    this.goalAmount = goalAmount;
    this.currentSavings = currentSavings;
    this.rate = ratePercentage;
    this.years = years;
  }

  /**
   * Validates that all inputs are within acceptable ranges.
   * @throws {Error} If any input is invalid or goal is already met.
   */
  _validate() {
    if (this.goalAmount <= 0) {
      throw new Error("Goal amount must be greater than zero.");
    }
    if (this.currentSavings < 0) {
      throw new Error("Current savings must be zero or greater.");
    }
    if (this.rate < 0 || this.rate > 100) {
      throw new Error("Rate must be between 0 and 100.");
    }
    if (this.years <= 0) {
      throw new Error("Years must be greater than zero.");
    }
    if (this.currentSavings >= this.goalAmount) {
      throw new Error("Goal is already met with current savings.");
    }
  }

  /**
   * Computes the monthly savings needed and the interest earned.
   * @returns A {@link SavingsGoalResult} with monthlySavings, totalContributions, and interestEarned.
   * @throws {Error} If any input is invalid.
   */
  calculate(): SavingsGoalResult {
    this._validate();

    const totalMonths = this.years * 12;

    if (this.rate === 0) {
      const monthlySavings = Number.parseFloat(
        ((this.goalAmount - this.currentSavings) / totalMonths).toFixed(2)
      );
      const totalContributions = Number.parseFloat(
        (monthlySavings * totalMonths).toFixed(2)
      );
      return { monthlySavings, totalContributions, interestEarned: 0 };
    }

    const monthlyRate = this.rate / 100 / 12;
    const factor = Math.pow(1 + monthlyRate, totalMonths);

    const fvInitial = this.currentSavings * factor;
    const remaining = this.goalAmount - fvInitial;

    if (remaining <= 0) {
      const interestEarned = Number.parseFloat(
        (fvInitial - this.currentSavings).toFixed(2)
      );
      return { monthlySavings: 0, totalContributions: 0, interestEarned };
    }

    // PMT for future value of annuity: FV = PMT * ((1+r)^n - 1) / r
    // PMT = FV * r / ((1+r)^n - 1)
    const monthlySavings = Number.parseFloat(
      (remaining * monthlyRate / (factor - 1)).toFixed(2)
    );

    const totalContributions = Number.parseFloat(
      (monthlySavings * totalMonths).toFixed(2)
    );
    const interestEarned = Number.parseFloat(
      (this.goalAmount - this.currentSavings - totalContributions).toFixed(2)
    );

    return { monthlySavings, totalContributions, interestEarned };
  }
}
