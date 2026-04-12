import RuleOf72 from "../calculators/RuleOf72";

describe("RuleOf72", () => {
  it("should raise error on non-positive rate.", () => {
    const r = new RuleOf72(0);
    expect(() => r.calculate()).toThrow("Rate must be greater than 0 and at most 100.");
  });
  it("should raise error on rate > 100.", () => {
    const r = new RuleOf72(101);
    expect(() => r.calculate()).toThrow("Rate must be greater than 0 and at most 100.");
  });

  it("should estimate ~7.2 years to double at 10%.", () => {
    const r = new RuleOf72(10);
    const result = r.calculate();
    expect(result.estimatedYears).toBe(7.2);
  });

  it("should estimate ~12 years to double at 6%.", () => {
    const r = new RuleOf72(6);
    const result = r.calculate();
    expect(result.estimatedYears).toBe(12);
  });

  it("should estimate ~36 years to double at 2%.", () => {
    const r = new RuleOf72(2);
    const result = r.calculate();
    expect(result.estimatedYears).toBe(36);
  });

  it("should also return exact doubling time.", () => {
    const r = new RuleOf72(10);
    const result = r.calculate();
    // ln(2) / ln(1.1) = 7.27
    expect(result.exactYears).toBe(7.27);
  });
  it("should raise error on negative rate.", () => {
    const r = new RuleOf72(-5);
    expect(() => r.calculate()).toThrow(
      "Rate must be greater than 0 and at most 100."
    );
  });
  it("should handle rate of exactly 100%.", () => {
    const r = new RuleOf72(100);
    const result = r.calculate();
    expect(result.estimatedYears).toBe(0.72);
    expect(result.exactYears).toBe(1);
  });
});
