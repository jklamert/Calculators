import SimpleInterest from "../calculators/SimpleInterest";

describe("Simple Interest", () => {
  it("should raise error on invalid years.", () => {
    const SI = new SimpleInterest(100, 10, -1);
    expect(() => {
      SI.calculate();
    }).toThrow("Simple Interest requires a time span >= 0.");
  });
  it("should raise error on invalid rate.", () => {
    const SI = new SimpleInterest(100, -1, 1);
    expect(() => {
      SI.calculate();
    }).toThrow("Simple Interest requires a rate between 0 and 100 percent.");
  });
  it("should raise error on invalid principal.", () => {
    const SI = new SimpleInterest(-1, 10, 1);
    expect(() => {
      SI.calculate();
    }).toThrow("Simple Interest requires a principal greater than zero.");
  });
  it("should raise error on zero principal.", () => {
    const SI = new SimpleInterest(0, 10, 1);
    expect(() => {
      SI.calculate();
    }).toThrow("Simple Interest requires a principal greater than zero.");
  });

  it("should be 110 for a principal of 100, 1 year, and a rate of 10%.", () => {
    const SI = new SimpleInterest(100, 10, 1);
    expect(SI.calculate()).toBe(110);
  });
  it("should be 120 for a principal of 100, 2 year, and a rate of 10%.", () => {
    const SI = new SimpleInterest(100, 10, 2);
    expect(SI.calculate()).toBe(120);
  });
  it("should return principal when rate is 0%.", () => {
    const SI = new SimpleInterest(500, 0, 5);
    expect(SI.calculate()).toBe(500);
  });
  it("should return principal when years is 0.", () => {
    const SI = new SimpleInterest(500, 10, 0);
    expect(SI.calculate()).toBe(500);
  });
  it("should raise error on rate > 100.", () => {
    const SI = new SimpleInterest(100, 101, 1);
    expect(() => {
      SI.calculate();
    }).toThrow("Simple Interest requires a rate between 0 and 100 percent.");
  });
  it("should round to 2 decimal places.", () => {
    const SI = new SimpleInterest(1000, 7.3, 3);
    expect(SI.calculate()).toBe(1219);
  });
  it("should handle rate of exactly 100%.", () => {
    const SI = new SimpleInterest(1000, 100, 1);
    expect(SI.calculate()).toBe(2000);
  });
});
