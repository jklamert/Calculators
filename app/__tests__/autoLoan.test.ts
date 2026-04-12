import AutoLoan from "../calculators/AutoLoan";

describe("AutoLoan", () => {
  it("should raise error on non-positive vehicle price.", () => {
    const AL = new AutoLoan(0, 0, 5, 5);
    expect(() => AL.calculate()).toThrow(
      "Vehicle price must be greater than zero."
    );
  });
  it("should raise error on negative down payment.", () => {
    const AL = new AutoLoan(30000, -1000, 5, 5);
    expect(() => AL.calculate()).toThrow(
      "Down payment must be zero or greater."
    );
  });
  it("should raise error on down payment >= price.", () => {
    const AL = new AutoLoan(30000, 30000, 5, 5);
    expect(() => AL.calculate()).toThrow(
      "Down payment must be less than the vehicle price."
    );
  });
  it("should raise error on non-positive rate.", () => {
    const AL = new AutoLoan(30000, 5000, 0, 5);
    expect(() => AL.calculate()).toThrow(
      "Rate must be greater than 0 and less than 100."
    );
  });
  it("should raise error on non-positive term.", () => {
    const AL = new AutoLoan(30000, 5000, 5, 0);
    expect(() => AL.calculate()).toThrow(
      "Term in months must be a positive integer."
    );
  });
  it("should raise error on non-integer term.", () => {
    const AL = new AutoLoan(30000, 5000, 5, 5.5);
    expect(() => AL.calculate()).toThrow(
      "Term in months must be a positive integer."
    );
  });

  it("should calculate auto loan for $30k car, $5k down, 5% rate, 60 months.", () => {
    const AL = new AutoLoan(30000, 5000, 5, 60);
    const result = AL.calculate();
    expect(result.loanAmount).toBe(25000);
    expect(result.monthlyPayment).toBe(471.78);
    expect(result.totalPaid).toBe(28306.80);
    expect(result.totalInterest).toBe(3306.80);
  });

  it("should work with zero down payment.", () => {
    const AL = new AutoLoan(20000, 0, 4.5, 48);
    const result = AL.calculate();
    expect(result.loanAmount).toBe(20000);
    expect(result.monthlyPayment).toBe(456.07);
  });

  it("should calculate short 12-month loan.", () => {
    const AL = new AutoLoan(15000, 3000, 6, 12);
    const result = AL.calculate();
    expect(result.loanAmount).toBe(12000);
    expect(result.monthlyPayment).toBe(1032.80);
  });
  it("should raise error on rate >= 100.", () => {
    const AL = new AutoLoan(30000, 5000, 100, 60);
    expect(() => AL.calculate()).toThrow(
      "Rate must be greater than 0 and less than 100."
    );
  });
  it("should raise error on negative vehicle price.", () => {
    const AL = new AutoLoan(-10000, 0, 5, 60);
    expect(() => AL.calculate()).toThrow(
      "Vehicle price must be greater than zero."
    );
  });
  it("should have totalInterest > 0 for any valid loan.", () => {
    const AL = new AutoLoan(25000, 5000, 3, 36);
    const result = AL.calculate();
    expect(result.totalInterest).toBeGreaterThan(0);
    expect(result.totalPaid).toBeGreaterThan(result.loanAmount);
  });
});
