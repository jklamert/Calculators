export enum Compound {
  Monthly = "MONTHLY",
  Quarterly = "QUARTERLY",
  Annually = "ANNUALLY",
}

/**
 * Class responsible for compound interest calculations.
 */
export default class CompoundInterest {
  principal = 0;
  rate = 0;
  years = 0;
  compound = null;

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
   * Method that validates the compound interest members.
   */
  _validate() {
    if (this.principal < 0) {
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
   * Method to process the compounding modes and obtain the decimal years to compound by.
   * @returns Compound in decimal years.
   */
  _processCompoundMode() {
    let compound = null;
    switch (this.compound) {
      case Compound.Annually:
        compound = 1;
        break;
      case Compound.Monthly:
        compound = 12;
        break;
      case Compound.Quarterly:
        compound = 4;
        break;
      default:
        //Never should hit this as the validator should catch it.
        throw new Error(
          "Compound Interest calculator only supports three compounding modes: Annually, Monthly, or Quarterly."
        );
    }
    return compound;
  }

  /**
   * Method to apply the compound interest using the class members as the configuration.
   * @returns New Balance
   */
  calculate() {
    this._validate();
    const compoundNumber = this._processCompoundMode();

    //A = P(1 + r/n)^nt (Compount Interest Formula)
    const rateAsDecimal = this.rate / 100;

    const superscript = compoundNumber * this.years;
    const step1 = 1 + rateAsDecimal / compoundNumber;
    const step2 = Math.pow(step1, superscript);
    const result = this.principal * step2;

    return Number.parseFloat(result.toFixed(2));
  }
}
