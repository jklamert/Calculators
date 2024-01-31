import SimpleInterest from "../calculators/simpleInterest";

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
  it("should raise error on invalid prinicipal.", () => {
    const SI = new SimpleInterest(-1, 10, 1);
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
});
