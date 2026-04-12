export interface DebtPayoffResult {
  months: number;
  totalPaid: number;
  totalInterest: number;
}

/**
 * Calculates how long it takes to pay off a debt given a fixed monthly payment.
 * Simulates month-by-month repayment, applying interest before each payment.
 *
 * @example
 * ```typescript
 * const dp = new DebtPayoff(5000, 18, 200);
 * const result = dp.calculate();
 * result.months;        // 32
 * result.totalInterest; // 1313.97
 * ```
 */
export default class DebtPayoff {
  balance: number;
  rate: number;
  monthlyPayment: number;

  /**
   * @param balance - Outstanding debt balance (must be > 0).
   * @param ratePercentage - Annual interest rate as a percentage (0 < rate < 100).
   * @param monthlyPayment - Fixed monthly payment amount (must exceed monthly interest).
   */
  constructor(
    balance: number,
    ratePercentage: number,
    monthlyPayment: number
  ) {
    this.balance = balance;
    this.rate = ratePercentage;
    this.monthlyPayment = monthlyPayment;
  }

  /**
   * Validates that all inputs are within acceptable ranges.
   * @throws {Error} If any input is invalid or payment is too small to cover interest.
   */
  _validate() {
    if (this.balance <= 0) {
      throw new Error("Balance must be greater than zero.");
    }
    if (this.rate <= 0 || this.rate >= 100) {
      throw new Error("Rate must be greater than 0 and less than 100.");
    }
    if (this.monthlyPayment <= 0) {
      throw new Error("Monthly payment must be greater than zero.");
    }
    const monthlyInterest = this.balance * (this.rate / 100 / 12);
    if (this.monthlyPayment <= monthlyInterest) {
      throw new Error(
        "Monthly payment must exceed monthly interest. The debt will never be paid off."
      );
    }
  }

  /**
   * Simulates monthly repayment and returns the payoff timeline.
   * @returns A {@link DebtPayoffResult} with months, totalPaid, and totalInterest.
   * @throws {Error} If any input is invalid.
   */
  calculate(): DebtPayoffResult {
    this._validate();

    const monthlyRate = this.rate / 100 / 12;
    const MAX_MONTHS = 10000;
    let remaining = this.balance;
    let months = 0;
    let totalPaid = 0;

    while (remaining > 0 && months < MAX_MONTHS) {
      months++;
      const interest = Number.parseFloat((remaining * monthlyRate).toFixed(2));
      let payment = this.monthlyPayment;

      if (remaining + interest <= payment) {
        payment = Number.parseFloat((remaining + interest).toFixed(2));
      }

      remaining = Number.parseFloat((remaining + interest - payment).toFixed(2));
      totalPaid += payment;
    }

    totalPaid = Number.parseFloat(totalPaid.toFixed(2));
    const totalInterest = Number.parseFloat((totalPaid - this.balance).toFixed(2));

    return { months, totalPaid, totalInterest };
  }
}
