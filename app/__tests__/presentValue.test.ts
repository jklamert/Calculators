import PresentValue from "../calculators/PresentValue";

describe("PresentValue", () => {
  it("should raise error on non-positive future value.", () => {
    const PV = new PresentValue(0, 5, 10);
    expect(() => PV.calculate()).toThrow(
      "Future value must be greater than zero."
    );
  });
  it("should raise error on negative rate.", () => {
    const PV = new PresentValue(10000, -1, 10);
    expect(() => PV.calculate()).toThrow(
      "Rate must be between 0 and 100."
    );
  });
  it("should raise error on rate > 100.", () => {
    const PV = new PresentValue(10000, 101, 10);
    expect(() => PV.calculate()).toThrow(
      "Rate must be between 0 and 100."
    );
  });
  it("should raise error on non-positive years.", () => {
    const PV = new PresentValue(10000, 5, 0);
    expect(() => PV.calculate()).toThrow(
      "Years must be greater than zero."
    );
  });

  it("should calculate PV of $10,000 at 5% over 10 years.", () => {
    // PV = 10000 / (1.05)^10 = 6139.13
    const PV = new PresentValue(10000, 5, 10);
    expect(PV.calculate()).toBe(6139.13);
  });

  it("should calculate PV of $50,000 at 8% over 20 years.", () => {
    // PV = 50000 / (1.08)^20
    const PV = new PresentValue(50000, 8, 20);
    expect(PV.calculate()).toBe(10727.41);
  });

  it("should return future value when rate is 0.", () => {
    const PV = new PresentValue(10000, 0, 10);
    expect(PV.calculate()).toBe(10000);
  });
  it("should raise error on negative future value.", () => {
    const PV = new PresentValue(-5000, 5, 10);
    expect(() => PV.calculate()).toThrow("Future value must be greater than zero.");
  });
  it("should raise error on negative years.", () => {
    const PV = new PresentValue(10000, 5, -1);
    expect(() => PV.calculate()).toThrow("Years must be greater than zero.");
  });
  it("should handle fractional years.", () => {
    const PV = new PresentValue(10000, 5, 2.5);
    // PV = 10000 / (1.05)^2.5
    expect(PV.calculate()).toBe(8851.70);
  });
});
