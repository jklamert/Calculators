import Mortgage from "../calculators/mortgage";

describe("Mortgage", () => {
  it("should raise error on invalid years.", () => {
    const HOME_PRICE = 250000;
    const MORTGAGE_RATE = 7.1;
    const DOWN_PAYMENT = 50000;
    const YEARS = -30;
    const MC = new Mortgage(HOME_PRICE, DOWN_PAYMENT, MORTGAGE_RATE, YEARS);
    expect(() => {
      MC.calculate();
    }).toThrow("Mortgage requires a time span >= 0 and must be an integer.");
  });
  it("should raise error on invalid rate.", () => {
    const HOME_PRICE = 250000;
    const MORTGAGE_RATE = -7.1;
    const DOWN_PAYMENT = 50000;
    const YEARS = 30;
    const MC = new Mortgage(HOME_PRICE, DOWN_PAYMENT, MORTGAGE_RATE, YEARS);
    expect(() => {
      MC.calculate();
    }).toThrow("Mortgage requires 0 <= rate <= 100.");
  });
  it("should raise error on invalid amount.", () => {
    const HOME_PRICE = -250000;
    const MORTGAGE_RATE = 7.1;
    const DOWN_PAYMENT = 50000;
    const YEARS = 30;
    const MC = new Mortgage(HOME_PRICE, DOWN_PAYMENT, MORTGAGE_RATE, YEARS);
    expect(() => {
      MC.calculate();
    }).toThrow("Mortgage requires a amount greater than zero.");
  });
  it("should raise error on invalid down payment.", () => {
    const HOME_PRICE = 250000;
    const MORTGAGE_RATE = 7.1;
    const DOWN_PAYMENT = -15000;
    const YEARS = 30;
    const MC = new Mortgage(HOME_PRICE, DOWN_PAYMENT, MORTGAGE_RATE, YEARS);
    expect(() => {
      MC.calculate();
    }).toThrow("The down payment must be positive.");
  });

  it("Mortgage Should have payment of 1344.06", () => {
    const HOME_PRICE = 250000;
    const MORTGAGE_RATE = 7.1;
    const DOWN_PAYMENT = 50000;
    const YEARS = 30;
    const MC = new Mortgage(HOME_PRICE, DOWN_PAYMENT, MORTGAGE_RATE, YEARS);
    const result = MC.calculate();
    const {
      totalNumberOfPayments,
      // totalInterest,
      monthlyPayment,
      yearlyPayment,
      // amortizationTable,
    } = result;
    expect(monthlyPayment).toBe(1344.06);
    expect(totalNumberOfPayments).toBe(360);
    expect(yearlyPayment).toBe(16128.72);
  });
});
