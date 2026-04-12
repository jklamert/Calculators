export interface AmortizationEntry {
  payment: number;
  principal: number;
  interest: number;
  remainingBalance: number;
}

export interface AmortizationResult {
  monthlyPayment: number;
  totalPayments: number;
  totalInterest: number;
  schedule: AmortizationEntry[];
}

/**
 * Generates a full loan amortization schedule with monthly payment breakdown
 * showing principal, interest, and remaining balance for each payment.
 *
 * Uses the formula: M = P[r(1+r)^n] / [(1+r)^n - 1]
 *
 * @example
 * ```typescript
 * const la = new LoanAmortization(200000, 6, 30);
 * const result = la.calculate();
 * result.monthlyPayment; // 1199.10
 * result.schedule[0];    // { payment: 1, principal: 199.10, interest: 1000, remainingBalance: 199800.90 }
 * ```
 */
export default class LoanAmortization {
  loanAmount: number;
  rate: number;
  years: number;

  /**
   * @param loanAmount - Loan principal (must be > 0).
   * @param ratePercentage - Annual interest rate as a percentage (0 < rate < 100).
   * @param years - Loan term in years (positive integer, max 100).
   */
  constructor(loanAmount: number, ratePercentage: number, years: number) {
    this.loanAmount = loanAmount;
    this.rate = ratePercentage;
    this.years = years;
  }

  /**
   * Validates that all inputs are within acceptable ranges.
   * @throws {Error} If any input is invalid.
   */
  _validate() {
    if (this.loanAmount <= 0) {
      throw new Error("Loan amount must be greater than zero.");
    }
    if (this.rate <= 0 || this.rate >= 100) {
      throw new Error("Rate must be greater than 0 and less than 100.");
    }
    if (this.years <= 0 || !Number.isInteger(this.years)) {
      throw new Error("Years must be a positive integer.");
    }
    if (this.years > 100) {
      throw new Error("Years must not exceed 100.");
    }
  }

  /**
   * Computes the monthly payment and generates the full amortization schedule.
   * @returns An {@link AmortizationResult} with monthlyPayment, totalPayments, totalInterest, and schedule.
   * @throws {Error} If any input is invalid.
   */
  calculate(): AmortizationResult {
    this._validate();

    const monthlyRate = this.rate / 100 / 12;
    const totalPayments = this.years * 12;

    const factor = Math.pow(1 + monthlyRate, totalPayments);
    const monthlyPayment = Number.parseFloat(
      (this.loanAmount * (monthlyRate * factor) / (factor - 1)).toFixed(2)
    );

    let balance = this.loanAmount;
    let totalInterest = 0;
    const schedule: AmortizationEntry[] = [];

    for (let i = 0; i < totalPayments; i++) {
      const interest = Number.parseFloat((balance * monthlyRate).toFixed(2));
      let principal = Number.parseFloat((monthlyPayment - interest).toFixed(2));

      balance = Number.parseFloat((balance - principal).toFixed(2));

      // Adjust payment to zero out balance if rounding caused overshoot
      // or if this is the final payment with a small remaining balance
      if (balance < 0 || (i === totalPayments - 1 && balance > 0)) {
        principal = Number.parseFloat((principal + balance).toFixed(2));
        balance = 0;
      }

      totalInterest += interest;

      schedule.push({
        payment: i + 1,
        principal,
        interest,
        remainingBalance: balance,
      });
    }

    return {
      monthlyPayment,
      totalPayments,
      totalInterest: Number.parseFloat(totalInterest.toFixed(2)),
      schedule,
    };
  }
}
