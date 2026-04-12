import DollarCostAveraging from "../calculators/DollarCostAveraging";

describe("DollarCostAveraging", () => {
  it("should raise error on non-positive investment amount.", () => {
    const DCA = new DollarCostAveraging(0, [100, 110, 120]);
    expect(() => DCA.calculate()).toThrow(
      "Investment amount must be greater than zero."
    );
  });
  it("should raise error on empty prices array.", () => {
    const DCA = new DollarCostAveraging(500, []);
    expect(() => DCA.calculate()).toThrow(
      "At least one price period is required."
    );
  });
  it("should raise error if any price is non-positive.", () => {
    const DCA = new DollarCostAveraging(500, [100, 0, 120]);
    expect(() => DCA.calculate()).toThrow(
      "All prices must be greater than zero."
    );
  });

  it("should calculate DCA for equal prices.", () => {
    // $100/period at $50 each time → 2 shares per period × 3 = 6 shares
    const DCA = new DollarCostAveraging(100, [50, 50, 50]);
    const result = DCA.calculate();
    expect(result.totalShares).toBe(6);
    expect(result.totalInvested).toBe(300);
    expect(result.averageCostPerShare).toBe(50);
    expect(result.currentValue).toBe(300);
  });

  it("should calculate DCA for varying prices.", () => {
    // $500 each month at prices [100, 80, 120, 90, 110]
    const DCA = new DollarCostAveraging(500, [100, 80, 120, 90, 110]);
    const result = DCA.calculate();
    expect(result.totalInvested).toBe(2500);
    // shares: 5 + 6.25 + 4.17 + 5.56 + 4.55 = 25.53 (approx)
    expect(result.totalShares).toBe(25.52);
    // avg cost = 2500 / 25.52
    expect(result.averageCostPerShare).toBe(97.96);
    // current value = shares * last price (110)
    expect(result.currentValue).toBe(2807.20);
  });

  it("should show gain/loss correctly.", () => {
    const DCA = new DollarCostAveraging(1000, [50, 40, 30]);
    const result = DCA.calculate();
    // shares: 20 + 25 + 33.33 = 78.33
    // invested: 3000, value at $30: 78.33 * 30 = 2349.9
    expect(result.totalInvested).toBe(3000);
    expect(result.totalShares).toBe(78.33);
    expect(result.currentValue).toBe(2349.90);
    expect(result.gainLoss).toBe(-650.10);
  });
  it("should raise error on negative investment amount.", () => {
    const DCA = new DollarCostAveraging(-500, [100]);
    expect(() => DCA.calculate()).toThrow(
      "Investment amount must be greater than zero."
    );
  });
  it("should raise error if any price is negative.", () => {
    const DCA = new DollarCostAveraging(500, [100, -50]);
    expect(() => DCA.calculate()).toThrow("All prices must be greater than zero.");
  });
  it("should work with single price period.", () => {
    const DCA = new DollarCostAveraging(1000, [25]);
    const result = DCA.calculate();
    expect(result.totalShares).toBe(40);
    expect(result.totalInvested).toBe(1000);
    expect(result.gainLoss).toBe(0);
  });
});
