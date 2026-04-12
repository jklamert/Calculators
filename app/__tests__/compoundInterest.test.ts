import CompoundInterest, { Compound } from "../calculators/CompoundInterest";

describe("Compound Interest", () => {
  it("should raise error on invalid years.", () => {
    const CI = new CompoundInterest(100, 10, -1, Compound.Annually);
    expect(() => {
      CI.calculate();
    }).toThrow("Compound Interest requires a time span >= 0.");
  });
  it("should raise error on invalid rate.", () => {
    const CI = new CompoundInterest(100, -1, 1, Compound.Annually);
    expect(() => {
      CI.calculate();
    }).toThrow("Compound Interest requires a rate between 0 and 100 percent.");
  });
  it("should raise error on invalid principal.", () => {
    const CI = new CompoundInterest(-1, 10, 1, Compound.Annually);
    expect(() => {
      CI.calculate();
    }).toThrow("Compound Interest requires a principal greater than zero.");
  });
  it("should raise error on zero principal.", () => {
    const CI = new CompoundInterest(0, 10, 1, Compound.Annually);
    expect(() => {
      CI.calculate();
    }).toThrow("Compound Interest requires a principal greater than zero.");
  });

  it("should be 25,937.42 for a principal of 10000, 10 year, and a rate of 10% compounding annually.", () => {
    const CI = new CompoundInterest(10000, 10, 10, Compound.Annually);
    expect(CI.calculate()).toBe(25937.42);
  });
  it("should be 26,850.64 for a principal of 10000, 10 year, and a rate of 10% compounding quarterly.", () => {
    const CI = new CompoundInterest(10000, 10, 10, Compound.Quarterly);
    expect(CI.calculate()).toBe(26850.64);
  });
  it("should be 27,070.41 for a principal of 10000, 10 year, and a rate of 10% compounding monthly.", () => {
    const CI = new CompoundInterest(10000, 10, 10, Compound.Monthly);
    expect(CI.calculate()).toBe(27070.41);
  });
  it("should be 20,438.32 for a principal of 10000, 7.5 year, and a rate of 10% compounding annually.", () => {
    const CI = new CompoundInterest(10000, 10, 7.5, Compound.Annually);
    expect(CI.calculate()).toBe(20438.32);
  });
  it("should return principal when rate is 0%.", () => {
    const CI = new CompoundInterest(5000, 0, 10, Compound.Monthly);
    expect(CI.calculate()).toBe(5000);
  });
  it("should return principal when years is 0.", () => {
    const CI = new CompoundInterest(5000, 10, 0, Compound.Annually);
    expect(CI.calculate()).toBe(5000);
  });
  it("should raise error on rate > 100.", () => {
    const CI = new CompoundInterest(1000, 101, 1, Compound.Annually);
    expect(() => {
      CI.calculate();
    }).toThrow("Compound Interest requires a rate between 0 and 100 percent.");
  });
  it("should raise error on invalid compound mode.", () => {
    const CI = new CompoundInterest(1000, 5, 1, "DAILY" as Compound);
    expect(() => {
      CI.calculate();
    }).toThrow(
      "Compound Interest calculator only supports three compounding modes: Annually, Monthly, or Quarterly."
    );
  });
});
