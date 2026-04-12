import Mortgage from "../calculators/mortgage";

describe("Mortgage", () => {
  it("should raise error on negative years.", () => {
    const MC = new Mortgage(250000, 50000, 7.1, -30);
    expect(() => {
      MC.calculate();
    }).toThrow("Mortgage requires a time span > 0 and must be a positive integer.");
  });
  it("should raise error on zero years.", () => {
    const MC = new Mortgage(250000, 50000, 7.1, 0);
    expect(() => {
      MC.calculate();
    }).toThrow("Mortgage requires a time span > 0 and must be a positive integer.");
  });
  it("should raise error on non-integer years.", () => {
    const MC = new Mortgage(250000, 50000, 7.1, 15.5);
    expect(() => {
      MC.calculate();
    }).toThrow("Mortgage requires a time span > 0 and must be a positive integer.");
  });
  it("should raise error on invalid rate.", () => {
    const MC = new Mortgage(250000, 50000, -7.1, 30);
    expect(() => {
      MC.calculate();
    }).toThrow("Mortgage requires a rate greater than 0 and less than 100.");
  });
  it("should raise error on zero rate.", () => {
    const MC = new Mortgage(250000, 50000, 0, 30);
    expect(() => {
      MC.calculate();
    }).toThrow("Mortgage requires a rate greater than 0 and less than 100.");
  });
  it("should raise error on invalid amount.", () => {
    const MC = new Mortgage(-250000, 50000, 7.1, 30);
    expect(() => {
      MC.calculate();
    }).toThrow("Mortgage requires an amount greater than zero.");
  });
  it("should raise error on zero amount.", () => {
    const MC = new Mortgage(0, 0, 7.1, 30);
    expect(() => {
      MC.calculate();
    }).toThrow("Mortgage requires an amount greater than zero.");
  });
  it("should raise error on negative down payment.", () => {
    const MC = new Mortgage(250000, -15000, 7.1, 30);
    expect(() => {
      MC.calculate();
    }).toThrow("The down payment must be zero or greater.");
  });
  it("should raise error on down payment >= amount.", () => {
    const MC = new Mortgage(250000, 250000, 7.1, 30);
    expect(() => {
      MC.calculate();
    }).toThrow("The down payment must be less than the mortgage amount.");
  });

  it("Mortgage Should have payment of 1344.06", () => {
    const HOME_PRICE = 250000;
    const MORTGAGE_RATE = 7.1;
    const DOWN_PAYMENT = 50000;
    const YEARS = 30;
    const MC = new Mortgage(HOME_PRICE, DOWN_PAYMENT, MORTGAGE_RATE, YEARS);
    const result = MC.calculate();
    const { totalNumberOfPayments, monthlyPayment, yearlyPayment } = result;
    expect(monthlyPayment).toBe(1344.06);
    expect(totalNumberOfPayments).toBe(360);
    expect(yearlyPayment).toBe(16128.72);
  });

  it("should work with zero down payment.", () => {
    const MC = new Mortgage(200000, 0, 5.0, 30);
    const result = MC.calculate();
    expect(result.monthlyPayment).toBe(1073.64);
    expect(result.totalNumberOfPayments).toBe(360);
  });

  it("should calculate 15-year mortgage correctly.", () => {
    const MC = new Mortgage(300000, 60000, 6.5, 15);
    const result = MC.calculate();
    expect(result.totalNumberOfPayments).toBe(180);
    expect(result.monthlyPayment).toBe(2090.66);
  });
  it("should raise error on rate >= 100.", () => {
    const MC = new Mortgage(250000, 50000, 100, 30);
    expect(() => MC.calculate()).toThrow(
      "Mortgage requires a rate greater than 0 and less than 100."
    );
  });
  it("should raise error on down payment > amount.", () => {
    const MC = new Mortgage(200000, 300000, 5, 30);
    expect(() => MC.calculate()).toThrow(
      "The down payment must be less than the mortgage amount."
    );
  });
  it("should have yearly payment equal to 12 * monthly.", () => {
    const MC = new Mortgage(350000, 70000, 4.5, 30);
    const result = MC.calculate();
    expect(result.yearlyPayment).toBe(
      Number.parseFloat((result.monthlyPayment * 12).toFixed(2))
    );
  });
});
