import ROI from "../calculators/ROI";

describe("ROI", () => {
  it("should raise error on non-positive cost.", () => {
    const r = new ROI(0, 1500);
    expect(() => r.calculate()).toThrow("Cost must be greater than zero.");
  });
  it("should raise error on negative revenue.", () => {
    const r = new ROI(1000, -1);
    expect(() => r.calculate()).toThrow("Revenue must be zero or greater.");
  });

  it("should calculate basic ROI.", () => {
    // Invest $1000, get back $1500 → ROI = 50%
    const r = new ROI(1000, 1500);
    const result = r.calculate();
    expect(result.roi).toBe(50);
    expect(result.netProfit).toBe(500);
  });

  it("should calculate negative ROI (loss).", () => {
    const r = new ROI(1000, 800);
    const result = r.calculate();
    expect(result.roi).toBe(-20);
    expect(result.netProfit).toBe(-200);
  });

  it("should calculate zero ROI (break even).", () => {
    const r = new ROI(1000, 1000);
    const result = r.calculate();
    expect(result.roi).toBe(0);
    expect(result.netProfit).toBe(0);
  });

  it("should calculate annualized ROI when years provided.", () => {
    // $1000 → $2000 over 5 years → annualized = (2000/1000)^(1/5) - 1
    const r = new ROI(1000, 2000, 5);
    const result = r.calculate();
    expect(result.roi).toBe(100);
    expect(result.annualizedRoi).toBe(14.87);
  });

  it("should raise error on non-positive years when provided.", () => {
    const r = new ROI(1000, 2000, 0);
    expect(() => r.calculate()).toThrow("Years must be greater than zero.");
  });
  it("should calculate annualized ROI with total loss.", () => {
    const r = new ROI(1000, 0, 5);
    const result = r.calculate();
    expect(result.roi).toBe(-100);
    expect(result.annualizedRoi).toBe(-100);
  });
  it("should handle very large ROI.", () => {
    const r = new ROI(100, 10000);
    const result = r.calculate();
    expect(result.roi).toBe(9900);
    expect(result.netProfit).toBe(9900);
  });
});
