import LoanAmortization from "../calculators/LoanAmortization";

describe("LoanAmortization", () => {
  it("should raise error on non-positive loan amount.", () => {
    const LA = new LoanAmortization(0, 5, 30);
    expect(() => LA.calculate()).toThrow(
      "Loan amount must be greater than zero."
    );
  });
  it("should raise error on negative loan amount.", () => {
    const LA = new LoanAmortization(-1000, 5, 30);
    expect(() => LA.calculate()).toThrow(
      "Loan amount must be greater than zero."
    );
  });
  it("should raise error on non-positive rate.", () => {
    const LA = new LoanAmortization(100000, 0, 30);
    expect(() => LA.calculate()).toThrow(
      "Rate must be greater than 0 and less than 100."
    );
  });
  it("should raise error on rate >= 100.", () => {
    const LA = new LoanAmortization(100000, 100, 30);
    expect(() => LA.calculate()).toThrow(
      "Rate must be greater than 0 and less than 100."
    );
  });
  it("should raise error on non-positive years.", () => {
    const LA = new LoanAmortization(100000, 5, 0);
    expect(() => LA.calculate()).toThrow(
      "Years must be a positive integer."
    );
  });
  it("should raise error on non-integer years.", () => {
    const LA = new LoanAmortization(100000, 5, 2.5);
    expect(() => LA.calculate()).toThrow(
      "Years must be a positive integer."
    );
  });

  it("should calculate correct monthly payment for a 200k loan at 6% for 30 years.", () => {
    const LA = new LoanAmortization(200000, 6, 30);
    const result = LA.calculate();
    expect(result.monthlyPayment).toBe(1199.10);
    expect(result.totalPayments).toBe(360);
  });

  it("should have correct number of amortization entries.", () => {
    const LA = new LoanAmortization(200000, 6, 30);
    const result = LA.calculate();
    expect(result.schedule.length).toBe(360);
  });

  it("should have first payment with correct interest and principal split.", () => {
    const LA = new LoanAmortization(200000, 6, 30);
    const result = LA.calculate();
    const first = result.schedule[0];
    // First month interest: 200000 * 0.06 / 12 = 1000
    expect(first.interest).toBe(1000.00);
    expect(first.principal).toBe(199.10);
    expect(first.remainingBalance).toBe(199800.90);
  });

  it("should have final payment with remaining balance near zero.", () => {
    const LA = new LoanAmortization(200000, 6, 30);
    const result = LA.calculate();
    const last = result.schedule[result.schedule.length - 1];
    expect(last.remainingBalance).toBe(0);
  });

  it("should compute total interest paid.", () => {
    const LA = new LoanAmortization(200000, 6, 30);
    const result = LA.calculate();
    expect(result.totalInterest).toBe(231677.04);
  });

  it("should work for a short 1-year loan.", () => {
    const LA = new LoanAmortization(12000, 12, 1);
    const result = LA.calculate();
    expect(result.totalPayments).toBe(12);
    expect(result.schedule.length).toBe(12);
    expect(result.monthlyPayment).toBe(1066.19);
  });
  it("should raise error on negative rate.", () => {
    const LA = new LoanAmortization(100000, -5, 30);
    expect(() => LA.calculate()).toThrow(
      "Rate must be greater than 0 and less than 100."
    );
  });
  it("should raise error on negative years.", () => {
    const LA = new LoanAmortization(100000, 5, -1);
    expect(() => LA.calculate()).toThrow("Years must be a positive integer.");
  });
  it("should have all schedule entries with positive principal and interest.", () => {
    const LA = new LoanAmortization(50000, 5, 10);
    const result = LA.calculate();
    for (const entry of result.schedule) {
      expect(entry.principal).toBeGreaterThan(0);
      expect(entry.interest).toBeGreaterThanOrEqual(0);
      expect(entry.remainingBalance).toBeGreaterThanOrEqual(0);
    }
  });
  it("should raise error on years exceeding 100.", () => {
    const LA = new LoanAmortization(100000, 5, 101);
    expect(() => LA.calculate()).toThrow("Years must not exceed 100.");
  });
  it("should never have a negative remaining balance for any loan.", () => {
    // Test several different loan sizes and rates to catch rounding edge cases
    const configs = [
      { amount: 1000, rate: 5, years: 1 },
      { amount: 5000, rate: 18, years: 2 },
      { amount: 100000, rate: 3.5, years: 15 },
      { amount: 250000, rate: 7, years: 30 },
    ];
    for (const { amount, rate, years } of configs) {
      const LA = new LoanAmortization(amount, rate, years);
      const result = LA.calculate();
      for (const entry of result.schedule) {
        expect(entry.remainingBalance).toBeGreaterThanOrEqual(0);
      }
      expect(result.schedule[result.schedule.length - 1].remainingBalance).toBe(0);
    }
  });
});
