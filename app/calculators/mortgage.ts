/**
 * Class responsible for Mortgage calculations.
 */
export default class Mortgage {
  amount = 0;
  rate = 0;
  years = 0;
  downPayment = 0;

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
   * Method that validates the Mortgage members.
   */
  _validate() {
    if (this.amount < 0) {
      throw new Error("Mortgage requires a amount greater than zero.");
    }
    if (this.downPayment) {
      if (this.downPayment < 0) {
        throw new Error("The down payment must be positive.");
      }
    }
    if (this.rate <= 0 || this.rate >= 100) {
      throw new Error("Mortgage requires 0 <= rate <= 100.");
    }
    if (this.years < 0 || !Number.isInteger(this.years)) {
      throw new Error(
        "Mortgage requires a time span >= 0 and must be an integer."
      );
    }
  }

  /**
   * Method to apply the Mortgage using the class members as the configuration.
   * @returns New Balance
   */
  calculate() {
    this._validate();
    const rateAsDecimal = this.rate / 100;

    let loanAmnt = this.amount;
    if (this.downPayment) {
      loanAmnt = loanAmnt - this.downPayment;
    }

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

    // let interestAccumulator = 0;
    // const amortizationEntries = [];
    // for (let count = 0; count < this.years; count++) {
    //   const interest = Number.parseFloat((loanAmnt * rateAsDecimal).toFixed(2));
    //   const principleAmount = yearlyPayment - interest;
    //   const amortizedObjEntry = {
    //     interest: interest,
    //     principle: principleAmount,
    //   };

    //   amortizationEntries.push(amortizedObjEntry);
    //   interestAccumulator += interest;
    // }

    return {
      totalNumberOfPayments: totalPayments,
      // totalInterest: Number.parseFloat(interestAccumulator.toFixed(2)),
      monthlyPayment: monthlyPayment,
      yearlyPayment: Number.parseFloat(yearlyPayment.toFixed(2)),
      // amortizationTable: amortizationEntries,
    };
  }
}
