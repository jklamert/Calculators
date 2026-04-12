import DebtPayoff from "../calculators/DebtPayoff";

describe("DebtPayoff", () => {
  it("should raise error on non-positive balance.", () => {
    const DP = new DebtPayoff(0, 18, 200);
    expect(() => DP.calculate()).toThrow(
      "Balance must be greater than zero."
    );
  });
  it("should raise error on non-positive rate.", () => {
    const DP = new DebtPayoff(5000, 0, 200);
    expect(() => DP.calculate()).toThrow(
      "Rate must be greater than 0 and less than 100."
    );
  });
  it("should raise error on non-positive monthly payment.", () => {
    const DP = new DebtPayoff(5000, 18, 0);
    expect(() => DP.calculate()).toThrow(
      "Monthly payment must be greater than zero."
    );
  });
  it("should raise error if payment is too small to cover interest.", () => {
    // $10000 at 24% = $200/mo interest, but paying only $150
    const DP = new DebtPayoff(10000, 24, 150);
    expect(() => DP.calculate()).toThrow(
      "Monthly payment must exceed monthly interest. The debt will never be paid off."
    );
  });

  it("should calculate payoff for $5000 at 18% with $200/mo payments.", () => {
    const DP = new DebtPayoff(5000, 18, 200);
    const result = DP.calculate();
    expect(result.months).toBe(32);
    expect(result.totalPaid).toBe(6313.97);
    expect(result.totalInterest).toBe(1313.97);
  });

  it("should calculate payoff for $20000 at 6% with $500/mo payments.", () => {
    const DP = new DebtPayoff(20000, 6, 500);
    const result = DP.calculate();
    expect(result.months).toBe(45);
  });

  it("should handle exact payoff (no remainder).", () => {
    // Contrived case: just verify it terminates and balance reaches 0
    const DP = new DebtPayoff(1000, 12, 100);
    const result = DP.calculate();
    expect(result.months).toBeGreaterThan(0);
    expect(result.totalPaid).toBeGreaterThan(1000);
  });
  it("should raise error on rate >= 100.", () => {
    const DP = new DebtPayoff(5000, 100, 500);
    expect(() => DP.calculate()).toThrow(
      "Rate must be greater than 0 and less than 100."
    );
  });
  it("should raise error on negative balance.", () => {
    const DP = new DebtPayoff(-100, 18, 200);
    expect(() => DP.calculate()).toThrow("Balance must be greater than zero.");
  });
  it("should raise error on negative monthly payment.", () => {
    const DP = new DebtPayoff(5000, 18, -50);
    expect(() => DP.calculate()).toThrow(
      "Monthly payment must be greater than zero."
    );
  });
  it("should raise error when payment exactly equals interest.", () => {
    // $10000 at 12% = $100/mo interest exactly
    const DP = new DebtPayoff(10000, 12, 100);
    expect(() => DP.calculate()).toThrow(
      "Monthly payment must exceed monthly interest. The debt will never be paid off."
    );
  });
  it("should pay off in 1 month when payment is much larger than balance.", () => {
    const DP = new DebtPayoff(100, 12, 10000);
    const result = DP.calculate();
    expect(result.months).toBe(1);
    // Total paid = balance + 1 month interest = 100 + 100*0.12/12 = 101.00
    expect(result.totalPaid).toBe(101);
    expect(result.totalInterest).toBe(1);
  });
  it("should handle small balance payoff correctly.", () => {
    const DP = new DebtPayoff(50, 5, 25);
    const result = DP.calculate();
    expect(result.months).toBe(3);
    expect(result.totalPaid).toBeGreaterThan(50);
    expect(result.totalInterest).toBeGreaterThan(0);
  });
});
