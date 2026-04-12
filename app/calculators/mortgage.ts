export interface MortgageResult {
  totalNumberOfPayments: number;
  monthlyPayment: number;
  yearlyPayment: number;
}

/**
 * Calculates monthly and yearly mortgage payments using the standard
 * amortization formula: M = P[r(1+r)^n] / [(1+r)^n - 1].
 *
 * @example
 * ```typescript
 * const m = new Mortgage(300000, 60000, 6, 30);
 * const result = m.calculate();
 * result.monthlyPayment; // 1438.92
 * ```
 */
export default class Mortgage {
  amount = 0;
  rate = 0;
  years = 0;
  downPayment = 0;

  /**
   * @param amount - Total property price (must be > 0).
   * @param downPayment - Down payment amount (>= 0, must be less than amount).
   * @param ratePercentage - Annual interest rate as a percentage (0 < rate < 100).
   * @param years - Loan term in years (positive integer).
   */
  constructor(
    amount: number,
    downPayment: number,
    ratePercentage: number,
    years: number
  ) {
    this.amount = amount;
    this.downPayment = downPayment;
    this.rate = ratePercentage;
    this.years = years;
  }

  /**
   * Validates that all inputs are within acceptable ranges.
   * @throws {Error} If any input is invalid.
   */
  _validate() {
    if (this.amount <= 0) {
      throw new Error("Mortgage requires an amount greater than zero.");
    }
    if (this.downPayment < 0) {
      throw new Error("The down payment must be zero or greater.");
    }
    if (this.downPayment >= this.amount) {
      throw new Error(
        "The down payment must be less than the mortgage amount."
      );
    }
    if (this.rate <= 0 || this.rate >= 100) {
      throw new Error(
        "Mortgage requires a rate greater than 0 and less than 100."
      );
    }
    if (this.years <= 0 || !Number.isInteger(this.years)) {
      throw new Error(
        "Mortgage requires a time span > 0 and must be a positive integer."
      );
    }
  }

  /**
   * Calculates the monthly payment, yearly payment, and total number of payments.
   * @returns A {@link MortgageResult} with monthlyPayment, yearlyPayment, and totalNumberOfPayments.
   * @throws {Error} If any input is invalid.
   */
  calculate(): MortgageResult {
    this._validate();
    const rateAsDecimal = this.rate / 100;

    const loanAmnt = this.amount - this.downPayment;

    //FORMULA
    //M = P [ I(1 + I)^N ] / [ (1 + I)^N − 1]
    /*
    M = Monthly payment: This is what you’re solving for.
    P = Principal amount: This is the loan balance, or what you’re trying to pay off.
    I = Interest rate: Remember, you’ll want to use the base interest rate and not the APR. 
    Additionally, because the mortgage interest rate you’re charged is an annual interest rate that does represent the interest that’s supposed to be paid over the whole year, you want to divide this by 12 to get the monthly interest rate.
    N = Number of payments: This is the total number of payments in your loan term. For instance, if it’s a 30-year mortgage with monthly payments, there are 360 payments.
    */
    const rate = rateAsDecimal / 12;
    const totalPayments = this.years * 12;
    const step1 = 1 + rate;
    const step2 = Math.pow(step1, totalPayments);
    const step3 = rate * step2;
    const topOfFrac = loanAmnt * step3;

    const bottomFrac = step2 - 1;

    let monthlyPayment = topOfFrac / bottomFrac;
    monthlyPayment = Number.parseFloat(monthlyPayment.toFixed(2));

    const yearlyPayment = Number.parseFloat((monthlyPayment * 12).toFixed(2));

    return {
      totalNumberOfPayments: totalPayments,
      monthlyPayment: monthlyPayment,
      yearlyPayment: yearlyPayment,
    };
  }
}
