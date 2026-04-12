import TaxBracket from "../calculators/TaxBracket";

// Using 2024 US federal tax brackets for single filers as default
const US_2024_BRACKETS = [
  { min: 0, max: 11600, rate: 10 },
  { min: 11600, max: 47150, rate: 12 },
  { min: 47150, max: 100525, rate: 22 },
  { min: 100525, max: 191950, rate: 24 },
  { min: 191950, max: 243725, rate: 32 },
  { min: 243725, max: 609350, rate: 35 },
  { min: 609350, max: Infinity, rate: 37 },
];

describe("TaxBracket", () => {
  it("should raise error on non-positive income.", () => {
    const TB = new TaxBracket(0, US_2024_BRACKETS);
    expect(() => TB.calculate()).toThrow("Income must be greater than zero.");
  });
  it("should raise error on empty brackets.", () => {
    const TB = new TaxBracket(50000, []);
    expect(() => TB.calculate()).toThrow(
      "At least one tax bracket is required."
    );
  });
  it("should raise error on invalid bracket rate.", () => {
    const TB = new TaxBracket(50000, [{ min: 0, max: 50000, rate: -1 }]);
    expect(() => TB.calculate()).toThrow(
      "All bracket rates must be between 0 and 100."
    );
  });
  it("should raise error on bracket with min >= max.", () => {
    const TB = new TaxBracket(50000, [{ min: 50000, max: 50000, rate: 10 }]);
    expect(() => TB.calculate()).toThrow(
      "Bracket min must be less than bracket max."
    );
  });

  it("should calculate tax for income in first bracket only.", () => {
    const TB = new TaxBracket(10000, US_2024_BRACKETS);
    const result = TB.calculate();
    expect(result.totalTax).toBe(1000);
    expect(result.effectiveRate).toBe(10);
    expect(result.marginalRate).toBe(10);
  });

  it("should calculate tax for income spanning two brackets.", () => {
    const TB = new TaxBracket(30000, US_2024_BRACKETS);
    const result = TB.calculate();
    // 11600 * 0.10 = 1160
    // (30000 - 11600) * 0.12 = 18400 * 0.12 = 2208
    // Total: 3368
    expect(result.totalTax).toBe(3368);
    expect(result.marginalRate).toBe(12);
    expect(result.effectiveRate).toBe(11.23);
  });

  it("should calculate tax for $100,000 income.", () => {
    const TB = new TaxBracket(100000, US_2024_BRACKETS);
    const result = TB.calculate();
    // 11600 * 0.10 = 1160
    // (47150 - 11600) * 0.12 = 35550 * 0.12 = 4266
    // (100000 - 47150) * 0.22 = 52850 * 0.22 = 11627
    // Total: 17053
    expect(result.totalTax).toBe(17053);
    expect(result.marginalRate).toBe(22);
    expect(result.effectiveRate).toBe(17.05);
  });

  it("should calculate tax for high income $500,000.", () => {
    const TB = new TaxBracket(500000, US_2024_BRACKETS);
    const result = TB.calculate();
    // Bracket by bracket:
    // 11600 * 0.10 = 1160
    // 35550 * 0.12 = 4266
    // 53375 * 0.22 = 11742.50
    // 91425 * 0.24 = 21942
    // 51775 * 0.32 = 16568
    // 256275 * 0.35 = 89696.25
    // Total: 145374.75
    expect(result.totalTax).toBe(145374.75);
    expect(result.marginalRate).toBe(35);
  });

  it("should return bracket breakdown.", () => {
    const TB = new TaxBracket(30000, US_2024_BRACKETS);
    const result = TB.calculate();
    expect(result.brackets.length).toBe(2);
    expect(result.brackets[0]).toEqual({
      rate: 10,
      taxableAmount: 11600,
      tax: 1160,
    });
    expect(result.brackets[1]).toEqual({
      rate: 12,
      taxableAmount: 18400,
      tax: 2208,
    });
  });

  it("should work with simple flat tax.", () => {
    const TB = new TaxBracket(50000, [
      { min: 0, max: Infinity, rate: 15 },
    ]);
    const result = TB.calculate();
    expect(result.totalTax).toBe(7500);
    expect(result.effectiveRate).toBe(15);
    expect(result.marginalRate).toBe(15);
  });

  it("should raise error on overlapping brackets.", () => {
    const TB = new TaxBracket(50000, [
      { min: 0, max: 30000, rate: 10 },
      { min: 20000, max: 60000, rate: 20 },
    ]);
    expect(() => TB.calculate()).toThrow("Tax brackets must not overlap.");
  });
  it("should raise error on bracket rate > 100.", () => {
    const TB = new TaxBracket(50000, [{ min: 0, max: 50000, rate: 101 }]);
    expect(() => TB.calculate()).toThrow(
      "All bracket rates must be between 0 and 100."
    );
  });
  it("should handle brackets with gaps (untaxed ranges).", () => {
    // 0-10000 at 10%, 20000-50000 at 20% (gap 10000-20000 untaxed)
    const TB = new TaxBracket(30000, [
      { min: 0, max: 10000, rate: 10 },
      { min: 20000, max: 50000, rate: 20 },
    ]);
    const result = TB.calculate();
    // 10000 * 0.10 = 1000
    // (30000 - 20000) * 0.20 = 2000
    expect(result.totalTax).toBe(3000);
    expect(result.brackets.length).toBe(2);
  });
  it("should handle unordered brackets by sorting them.", () => {
    const TB = new TaxBracket(30000, [
      { min: 11600, max: 47150, rate: 12 },
      { min: 0, max: 11600, rate: 10 },
    ]);
    const result = TB.calculate();
    expect(result.totalTax).toBe(3368);
  });
});
