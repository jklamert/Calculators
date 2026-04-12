export interface AutoLoanResult {
  loanAmount: number;
  monthlyPayment: number;
  totalPaid: number;
  totalInterest: number;
}

/**
 * Auto loan calculator. Uses the standard amortization formula
 * with term specified in months: M = P[r(1+r)^n] / [(1+r)^n - 1].
 *
 * @example
 * ```typescript
 * const al = new AutoLoan(35000, 5000, 4.5, 60);
 * const result = al.calculate();
 * result.monthlyPayment; // 559.28
 * result.totalInterest;  // 3556.80
 * ```
 */
export default class AutoLoan {
  vehiclePrice: number;
  downPayment: number;
  rate: number;
  termMonths: number;

  /**
   * @param vehiclePrice - Total vehicle price (must be > 0).
   * @param downPayment - Down payment amount (>= 0, must be less than vehiclePrice).
   * @param ratePercentage - Annual interest rate as a percentage (0 < rate < 100).
   * @param termMonths - Loan term in months (positive integer).
   */
  constructor(
    vehiclePrice: number,
    downPayment: number,
    ratePercentage: number,
    termMonths: number
  ) {
    this.vehiclePrice = vehiclePrice;
    this.downPayment = downPayment;
    this.rate = ratePercentage;
    this.termMonths = termMonths;
  }

  /**
   * Validates that all inputs are within acceptable ranges.
   * @throws {Error} If any input is invalid.
   */
  _validate() {
    if (this.vehiclePrice <= 0) {
      throw new Error("Vehicle price must be greater than zero.");
    }
    if (this.downPayment < 0) {
      throw new Error("Down payment must be zero or greater.");
    }
    if (this.downPayment >= this.vehiclePrice) {
      throw new Error("Down payment must be less than the vehicle price.");
    }
    if (this.rate <= 0 || this.rate >= 100) {
      throw new Error("Rate must be greater than 0 and less than 100.");
    }
    if (this.termMonths <= 0 || !Number.isInteger(this.termMonths)) {
      throw new Error("Term in months must be a positive integer.");
    }
  }

  /**
   * Computes the monthly payment, total paid, and total interest for the auto loan.
   * @returns An {@link AutoLoanResult} with loanAmount, monthlyPayment, totalPaid, and totalInterest.
   * @throws {Error} If any input is invalid.
   */
  calculate(): AutoLoanResult {
    this._validate();

    const loanAmount = this.vehiclePrice - this.downPayment;
    const monthlyRate = this.rate / 100 / 12;

    const factor = Math.pow(1 + monthlyRate, this.termMonths);
    const monthlyPayment = Number.parseFloat(
      (loanAmount * (monthlyRate * factor) / (factor - 1)).toFixed(2)
    );

    const totalPaid = Number.parseFloat((monthlyPayment * this.termMonths).toFixed(2));
    const totalInterest = Number.parseFloat((totalPaid - loanAmount).toFixed(2));

    return { loanAmount, monthlyPayment, totalPaid, totalInterest };
  }
}
