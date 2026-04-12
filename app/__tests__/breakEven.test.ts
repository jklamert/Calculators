import BreakEven from "../calculators/BreakEven";

describe("BreakEven", () => {
  it("should raise error on non-positive fixed costs.", () => {
    const BE = new BreakEven(0, 50, 30);
    expect(() => BE.calculate()).toThrow("Fixed costs must be greater than zero.");
  });
  it("should raise error on non-positive price per unit.", () => {
    const BE = new BreakEven(10000, 0, 30);
    expect(() => BE.calculate()).toThrow("Price per unit must be greater than zero.");
  });
  it("should raise error on negative variable cost.", () => {
    const BE = new BreakEven(10000, 50, -1);
    expect(() => BE.calculate()).toThrow(
      "Variable cost per unit must be zero or greater."
    );
  });
  it("should raise error if variable cost >= price.", () => {
    const BE = new BreakEven(10000, 50, 50);
    expect(() => BE.calculate()).toThrow(
      "Variable cost per unit must be less than price per unit."
    );
  });

  it("should calculate break-even for simple case.", () => {
    // Fixed: $10000, Price: $50, Variable: $30
    // Contribution margin: $20, Break-even: 500 units
    const BE = new BreakEven(10000, 50, 30);
    const result = BE.calculate();
    expect(result.breakEvenUnits).toBe(500);
    expect(result.breakEvenRevenue).toBe(25000);
    expect(result.contributionMargin).toBe(20);
  });

  it("should round up to whole units.", () => {
    // Fixed: $10000, Price: $30, Variable: $10
    // CM: $20, BE: 500 exactly
    const BE = new BreakEven(10001, 30, 10);
    const result = BE.calculate();
    // 10001 / 20 = 500.05 → rounds up to 501
    expect(result.breakEvenUnits).toBe(501);
    expect(result.breakEvenRevenue).toBe(15030);
  });

  it("should handle zero variable cost.", () => {
    const BE = new BreakEven(5000, 25, 0);
    const result = BE.calculate();
    expect(result.breakEvenUnits).toBe(200);
    expect(result.contributionMargin).toBe(25);
  });

  it("should calculate contribution margin ratio.", () => {
    const BE = new BreakEven(10000, 50, 30);
    const result = BE.calculate();
    // CM ratio = 20/50 = 0.4 = 40%
    expect(result.contributionMarginRatio).toBe(40);
  });
  it("should raise error when variable cost > price.", () => {
    const BE = new BreakEven(10000, 30, 50);
    expect(() => BE.calculate()).toThrow(
      "Variable cost per unit must be less than price per unit."
    );
  });
  it("should raise error on negative fixed costs.", () => {
    const BE = new BreakEven(-5000, 50, 30);
    expect(() => BE.calculate()).toThrow("Fixed costs must be greater than zero.");
  });
  it("should raise error on negative price.", () => {
    const BE = new BreakEven(10000, -10, 5);
    expect(() => BE.calculate()).toThrow("Price per unit must be greater than zero.");
  });
});
