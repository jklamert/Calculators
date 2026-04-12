export interface Bracket {
  min: number;
  max: number;
  rate: number;
}

export interface BracketBreakdown {
  rate: number;
  taxableAmount: number;
  tax: number;
}

export interface TaxBracketResult {
  totalTax: number;
  effectiveRate: number;
  marginalRate: number;
  brackets: BracketBreakdown[];
}

/**
 * Calculates marginal (progressive) income tax given income and bracket definitions.
 * Brackets are sorted by min, validated for no overlap, and applied progressively.
 *
 * @example
 * ```typescript
 * const brackets = [
 *   { min: 0, max: 11000, rate: 10 },
 *   { min: 11000, max: 44725, rate: 12 },
 * ];
 * const tb = new TaxBracket(30000, brackets);
 * const result = tb.calculate();
 * result.totalTax;      // total tax owed
 * result.effectiveRate; // effective tax rate %
 * result.marginalRate;  // highest applicable bracket rate
 * ```
 */
export default class TaxBracket {
  income: number;
  taxBrackets: Bracket[];

  /**
   * @param income - Taxable income (must be > 0).
   * @param taxBrackets - Array of non-overlapping tax brackets (at least one required).
   */
  constructor(income: number, taxBrackets: Bracket[]) {
    this.income = income;
    this.taxBrackets = taxBrackets;
  }

  /**
   * Validates that all inputs are within acceptable ranges and brackets do not overlap.
   * @throws {Error} If any input is invalid or brackets overlap.
   */
  _validate() {
    if (this.income <= 0) {
      throw new Error("Income must be greater than zero.");
    }
    if (this.taxBrackets.length === 0) {
      throw new Error("At least one tax bracket is required.");
    }
    for (const bracket of this.taxBrackets) {
      if (bracket.rate < 0 || bracket.rate > 100) {
        throw new Error("All bracket rates must be between 0 and 100.");
      }
      if (bracket.min >= bracket.max) {
        throw new Error("Bracket min must be less than bracket max.");
      }
    }
    const sorted = [...this.taxBrackets].sort((a, b) => a.min - b.min);
    for (let i = 1; i < sorted.length; i++) {
      if (sorted[i].min < sorted[i - 1].max) {
        throw new Error("Tax brackets must not overlap.");
      }
    }
  }

  /**
   * Computes the progressive tax, effective rate, marginal rate, and per-bracket breakdown.
   * @returns A {@link TaxBracketResult} with totalTax, effectiveRate, marginalRate, and brackets.
   * @throws {Error} If any input is invalid.
   */
  calculate(): TaxBracketResult {
    this._validate();

    const sorted = [...this.taxBrackets].sort((a, b) => a.min - b.min);

    let totalTax = 0;
    let marginalRate = 0;
    const brackets: BracketBreakdown[] = [];

    for (const bracket of sorted) {
      if (this.income <= bracket.min) break;

      const taxableInBracket = Math.min(this.income, bracket.max) - bracket.min;
      const tax = Number.parseFloat(
        (taxableInBracket * (bracket.rate / 100)).toFixed(2)
      );

      if (taxableInBracket > 0) {
        brackets.push({
          rate: bracket.rate,
          taxableAmount: Number.parseFloat(taxableInBracket.toFixed(2)),
          tax,
        });
        totalTax += tax;
        marginalRate = bracket.rate;
      }
    }

    totalTax = Number.parseFloat(totalTax.toFixed(2));
    const effectiveRate = Number.parseFloat(
      ((totalTax / this.income) * 100).toFixed(2)
    );

    return { totalTax, effectiveRate, marginalRate, brackets };
  }
}
