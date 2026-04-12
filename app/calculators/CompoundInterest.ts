export enum Compound {
  Monthly = "MONTHLY",
  Quarterly = "QUARTERLY",
  Annually = "ANNUALLY",
}

/**
 * Calculates compound interest using the formula A = P(1 + r/n)^(nt).
 *
 * @example
 * ```typescript
 * const ci = new CompoundInterest(10000, 10, 10, Compound.Annually);
 * ci.calculate(); // 25937.42
 * ```
 */
export default class CompoundInterest {
  principal: number;
  rate: number;
  years: number;
  compound: Compound;

  /**
   * @param principal - The initial amount invested or borrowed (must be > 0).
   * @param ratePercentage - Annual interest rate as a percentage, 0-100.
   * @param years - Time period in years (>= 0).
   * @param compound - Compounding frequency: Monthly, Quarterly, or Annually.
   */
  constructor(
    principal: number,
    ratePercentage: number,
    years: number,
    compound: Compound
  ) {
    this.principal = principal;
    this.rate = ratePercentage;
    this.years = years;
    this.compound = compound;
  }

  /**
   * Validates that all inputs are within acceptable ranges.
   * @throws {Error} If any input is invalid.
   */
  _validate() {
    if (this.principal <= 0) {
      throw new Error(
        "Compound Interest requires a principal greater than zero."
      );
    }
    if (this.rate < 0 || this.rate > 100) {
      throw new Error(
        "Compound Interest requires a rate between 0 and 100 percent."
      );
    }
    if (this.years < 0) {
      throw new Error("Compound Interest requires a time span >= 0.");
    }
    const validCompounds = [
      Compound.Annually,
      Compound.Monthly,
      Compound.Quarterly,
    ];
    if (validCompounds.indexOf(this.compound) < 0) {
      throw new Error(
        "Compound Interest calculator only supports three compounding modes: Annually, Monthly, or Quarterly."
      );
    }
  }

  /**
   * Maps the compounding mode to the number of compounding periods per year.
   * @returns Number of compounding periods per year (1, 4, or 12).
   */
  _processCompoundMode(): number {
    switch (this.compound) {
      case Compound.Annually:
        return 1;
      case Compound.Monthly:
        return 12;
      case Compound.Quarterly:
        return 4;
      default:
        throw new Error(
          "Compound Interest calculator only supports three compounding modes: Annually, Monthly, or Quarterly."
        );
    }
  }

  /**
   * Computes the total amount after applying compound interest.
   * @returns The total amount (principal + compounded interest), rounded to 2 decimal places.
   * @throws {Error} If any input is invalid.
   */
  calculate(): number {
    this._validate();
    const compoundNumber = this._processCompoundMode();

    //A = P(1 + r/n)^nt (Compound Interest Formula)
    const rateAsDecimal = this.rate / 100;

    const superscript = compoundNumber * this.years;
    const step1 = 1 + rateAsDecimal / compoundNumber;
    const step2 = Math.pow(step1, superscript);
    const result = this.principal * step2;

    return Number.parseFloat(result.toFixed(2));
  }
}
