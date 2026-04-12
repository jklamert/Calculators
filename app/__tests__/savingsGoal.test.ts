import SavingsGoal from "../calculators/SavingsGoal";

describe("SavingsGoal", () => {
  it("should raise error on non-positive goal amount.", () => {
    const SG = new SavingsGoal(0, 0, 5, 5);
    expect(() => SG.calculate()).toThrow("Goal amount must be greater than zero.");
  });
  it("should raise error on negative current savings.", () => {
    const SG = new SavingsGoal(10000, -1, 5, 5);
    expect(() => SG.calculate()).toThrow(
      "Current savings must be zero or greater."
    );
  });
  it("should raise error on negative rate.", () => {
    const SG = new SavingsGoal(10000, 0, -1, 5);
    expect(() => SG.calculate()).toThrow("Rate must be between 0 and 100.");
  });
  it("should raise error on non-positive years.", () => {
    const SG = new SavingsGoal(10000, 0, 5, 0);
    expect(() => SG.calculate()).toThrow("Years must be greater than zero.");
  });
  it("should raise error if current savings already meet goal.", () => {
    const SG = new SavingsGoal(10000, 10000, 5, 5);
    expect(() => SG.calculate()).toThrow("Goal is already met with current savings.");
  });

  it("should calculate monthly savings needed with no initial balance and no interest.", () => {
    // Need $12000 in 2 years = $500/mo
    const SG = new SavingsGoal(12000, 0, 0, 2);
    const result = SG.calculate();
    expect(result.monthlySavings).toBe(500);
  });

  it("should calculate monthly savings with interest.", () => {
    // Need $50000, start with $0, 6% annual, 10 years
    const SG = new SavingsGoal(50000, 0, 6, 10);
    const result = SG.calculate();
    expect(result.monthlySavings).toBe(305.10);
    expect(result.totalContributions).toBeGreaterThan(0);
  });

  it("should account for existing savings.", () => {
    // Need $50000, start with $10000, 6% annual, 10 years
    const SG = new SavingsGoal(50000, 10000, 6, 10);
    const result = SG.calculate();
    // The $10000 grows, so less monthly saving needed
    expect(result.monthlySavings).toBeLessThan(305.10);
  });

  it("should return zero monthly if initial balance grows to meet goal.", () => {
    // $10000 at 8% for 30 years = $10000 * (1.00667)^360 = ~109,357
    // Goal of $50000 is easily met
    const SG = new SavingsGoal(50000, 10000, 8, 30);
    const result = SG.calculate();
    // Initial balance grows to ~$109k, so no monthly contribution needed
    expect(result.monthlySavings).toBe(0);
  });
  it("should raise error on rate > 100.", () => {
    const SG = new SavingsGoal(10000, 0, 101, 5);
    expect(() => SG.calculate()).toThrow("Rate must be between 0 and 100.");
  });
  it("should raise error on negative years.", () => {
    const SG = new SavingsGoal(10000, 0, 5, -1);
    expect(() => SG.calculate()).toThrow("Years must be greater than zero.");
  });
});
