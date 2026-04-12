import RetirementSavings from "../calculators/RetirementSavings";

describe("RetirementSavings", () => {
  it("should raise error on negative initial balance.", () => {
    const RS = new RetirementSavings(-1, 500, 7, 30);
    expect(() => RS.calculate()).toThrow(
      "Initial balance must be zero or greater."
    );
  });
  it("should raise error on negative monthly contribution.", () => {
    const RS = new RetirementSavings(0, -500, 7, 30);
    expect(() => RS.calculate()).toThrow(
      "Monthly contribution must be zero or greater."
    );
  });
  it("should raise error on rate out of range.", () => {
    const RS = new RetirementSavings(0, 500, -1, 30);
    expect(() => RS.calculate()).toThrow(
      "Rate must be between 0 and 100."
    );
  });
  it("should raise error on non-positive years.", () => {
    const RS = new RetirementSavings(0, 500, 7, 0);
    expect(() => RS.calculate()).toThrow(
      "Years must be greater than zero."
    );
  });

  it("should calculate future value with no initial balance.", () => {
    // $500/mo at 7% for 30 years
    const RS = new RetirementSavings(0, 500, 7, 30);
    const result = RS.calculate();
    expect(result.futureValue).toBe(609985.50);
    expect(result.totalContributions).toBe(180000);
    expect(result.totalInterest).toBe(429985.50);
  });

  it("should calculate future value with initial balance and no contributions.", () => {
    // $10000 initial, $0/mo at 7% for 30 years
    const RS = new RetirementSavings(10000, 0, 7, 30);
    const result = RS.calculate();
    expect(result.futureValue).toBe(81164.97);
    expect(result.totalContributions).toBe(0);
    expect(result.totalInterest).toBe(71164.97);
  });

  it("should calculate future value with both initial balance and contributions.", () => {
    // $10000 initial, $200/mo at 6% for 20 years
    const RS = new RetirementSavings(10000, 200, 6, 20);
    const result = RS.calculate();
    expect(result.futureValue).toBe(125510.22);
    expect(result.totalContributions).toBe(48000);
  });

  it("should handle zero rate (just accumulation).", () => {
    const RS = new RetirementSavings(1000, 100, 0, 10);
    const result = RS.calculate();
    expect(result.futureValue).toBe(13000);
    expect(result.totalContributions).toBe(12000);
    expect(result.totalInterest).toBe(0);
  });
  it("should raise error on rate > 100.", () => {
    const RS = new RetirementSavings(0, 500, 101, 30);
    expect(() => RS.calculate()).toThrow("Rate must be between 0 and 100.");
  });
  it("should raise error on negative years.", () => {
    const RS = new RetirementSavings(0, 500, 7, -5);
    expect(() => RS.calculate()).toThrow("Years must be greater than zero.");
  });
});
