export default class SimpleInterest {
  principal = 0;
  rate = 0;
  years = 0;

  constructor(principal: number, ratePercentage: number, years: number) {
    this.principal = principal;
    this.rate = ratePercentage;
    this.years = years;
  }

  calculate() {
    if (this.principal < 0) {
      throw new Error(
        "Simple Interest requires a principal greater than zero."
      );
    }
    if (this.rate < 0 || this.rate > 100) {
      throw new Error(
        "Simple Interest requires a rate between 0 and 100 percent."
      );
    }
    if (this.years < 0) {
      throw new Error("Simple Interest requires a time span >= 0.");
    }
    const rateAsDecimal = this.rate / 100;
    const result = this.principal * rateAsDecimal * this.years;

    return this.principal + result;
  }
}
