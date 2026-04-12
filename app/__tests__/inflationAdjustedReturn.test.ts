import InflationAdjustedReturn from "../calculators/InflationAdjustedReturn";

describe("InflationAdjustedReturn", () => {
  it("should raise error on rate out of range.", () => {
    const IAR = new InflationAdjustedReturn(-1, 3);
    expect(() => IAR.calculate()).toThrow("Nominal rate must be between 0 and 100.");
  });
  it("should raise error on negative inflation rate.", () => {
    const IAR = new InflationAdjustedReturn(10, -1);
    expect(() => IAR.calculate()).toThrow("Inflation rate must be at least 0 and less than 100.");
  });
  it("should raise error if inflation >= 100.", () => {
    const IAR = new InflationAdjustedReturn(10, 100);
    expect(() => IAR.calculate()).toThrow("Inflation rate must be at least 0 and less than 100.");
  });

  it("should calculate real return for 10% nominal and 3% inflation.", () => {
    // Real = ((1 + 0.10) / (1 + 0.03) - 1) * 100 = 6.80%
    const IAR = new InflationAdjustedReturn(10, 3);
    const result = IAR.calculate();
    expect(result.realReturn).toBe(6.80);
  });

  it("should calculate real return for 5% nominal and 2% inflation.", () => {
    const IAR = new InflationAdjustedReturn(5, 2);
    const result = IAR.calculate();
    expect(result.realReturn).toBe(2.94);
  });

  it("should return 0 when nominal equals inflation.", () => {
    const IAR = new InflationAdjustedReturn(3, 3);
    const result = IAR.calculate();
    expect(result.realReturn).toBe(0);
  });

  it("should return negative when inflation exceeds nominal.", () => {
    const IAR = new InflationAdjustedReturn(2, 5);
    const result = IAR.calculate();
    expect(result.realReturn).toBe(-2.86);
  });

  it("should handle zero inflation.", () => {
    const IAR = new InflationAdjustedReturn(8, 0);
    const result = IAR.calculate();
    expect(result.realReturn).toBe(8);
  });
  it("should raise error on nominal rate > 100.", () => {
    const IAR = new InflationAdjustedReturn(101, 3);
    expect(() => IAR.calculate()).toThrow("Nominal rate must be between 0 and 100.");
  });
  it("should return nominalRate and inflationRate in result.", () => {
    const IAR = new InflationAdjustedReturn(10, 3);
    const result = IAR.calculate();
    expect(result.nominalRate).toBe(10);
    expect(result.inflationRate).toBe(3);
  });
  it("should handle both rates at zero.", () => {
    const IAR = new InflationAdjustedReturn(0, 0);
    const result = IAR.calculate();
    expect(result.realReturn).toBe(0);
  });
});
