# Calculators

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18-339933.svg)](https://nodejs.org/)
[![Tests](https://img.shields.io/badge/Tests-173%20passing-brightgreen.svg)](#testing)

A TypeScript library of **15 financial calculators** covering interest, loans, investments, taxes, and business analysis. Zero dependencies, fully typed, with strict mode enabled.

---

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Calculators](#calculators)
  - [Interest & Growth](#interest--growth)
  - [Loans & Debt](#loans--debt)
  - [Investments & Savings](#investments--savings)
  - [Tax & Business](#tax--business)
- [Scripts](#scripts)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

---

## Installation

```bash
npm install calculators
```

Or clone and build from source:

```bash
git clone https://github.com/your-username/Calculators.git
cd Calculators
npm install
npm run build
```

## Quick Start

```typescript
import { Mortgage, CompoundInterest, Compound } from "calculators";

// Calculate monthly mortgage payment
const mortgage = new Mortgage(350000, 70000, 6.5, 30);
const result = mortgage.calculate();
console.log(result.monthlyPayment); // 1770.27

// Calculate compound interest
const ci = new CompoundInterest(10000, 5, 10, Compound.Monthly);
console.log(ci.calculate()); // 16470.09
```

## Calculators

### Interest & Growth

#### SimpleInterest

Calculates simple interest using `A = P(1 + rt)`.

```typescript
import { SimpleInterest } from "calculators";

const si = new SimpleInterest(1000, 5, 3);
// constructor(principal, ratePercentage, years)
console.log(si.calculate()); // 1150.00
```

| Parameter | Type | Description |
|---|---|---|
| `principal` | `number` | Initial amount (must be > 0) |
| `ratePercentage` | `number` | Annual rate as a percentage, 0-100 |
| `years` | `number` | Time period in years (>= 0) |

**Returns:** `number` — the total amount (principal + interest).

---

#### CompoundInterest

Calculates compound interest using `A = P(1 + r/n)^(nt)`.

```typescript
import { CompoundInterest, Compound } from "calculators";

const ci = new CompoundInterest(5000, 8, 5, Compound.Quarterly);
console.log(ci.calculate()); // 7429.74
```

| Parameter | Type | Description |
|---|---|---|
| `principal` | `number` | Initial amount (must be > 0) |
| `ratePercentage` | `number` | Annual rate, 0-100 |
| `years` | `number` | Time period (must be > 0) |
| `compound` | `Compound` | `Compound.Monthly`, `Compound.Quarterly`, or `Compound.Annually` |

**Returns:** `number` — the total amount after compounding.

---

#### RuleOf72

Estimates the time required to double an investment.

```typescript
import { RuleOf72 } from "calculators";

const r72 = new RuleOf72(8);
const result = r72.calculate();
console.log(result.estimatedYears); // 9
console.log(result.exactYears);     // 9.01
```

| Parameter | Type | Description |
|---|---|---|
| `ratePercentage` | `number` | Annual rate, 0 < rate < 100 |

**Returns:** `RuleOf72Result`

| Field | Type | Description |
|---|---|---|
| `estimatedYears` | `number` | 72 / rate (rounded to 2 decimals) |
| `exactYears` | `number` | ln(2) / ln(1 + rate/100) |

---

### Loans & Debt

#### Mortgage

Calculates monthly and yearly mortgage payments.

```typescript
import { Mortgage } from "calculators";

const m = new Mortgage(300000, 60000, 6, 30);
// constructor(amount, downPayment, ratePercentage, years)
const result = m.calculate();
console.log(result.monthlyPayment);        // 1438.92
console.log(result.yearlyPayment);         // 17267.04
console.log(result.totalNumberOfPayments); // 360
```

| Parameter | Type | Description |
|---|---|---|
| `amount` | `number` | Total property price (must be > 0) |
| `downPayment` | `number` | Down payment (>= 0, must be < amount) |
| `ratePercentage` | `number` | Annual rate, 0 < rate < 100 |
| `years` | `number` | Loan term as a positive integer |

**Returns:** `MortgageResult`

| Field | Type | Description |
|---|---|---|
| `monthlyPayment` | `number` | Monthly payment amount |
| `yearlyPayment` | `number` | Annual payment amount |
| `totalNumberOfPayments` | `number` | Total number of monthly payments |

---

#### LoanAmortization

Generates a full amortization schedule with principal/interest breakdown per payment.

```typescript
import { LoanAmortization } from "calculators";

const la = new LoanAmortization(200000, 6, 30);
const result = la.calculate();

console.log(result.monthlyPayment); // 1199.10
console.log(result.totalInterest);  // 231677.04
console.log(result.schedule[0]);
// { payment: 1, principal: 199.10, interest: 1000.00, remainingBalance: 199800.90 }
```

| Parameter | Type | Description |
|---|---|---|
| `loanAmount` | `number` | Loan principal (must be > 0) |
| `ratePercentage` | `number` | Annual rate, 0 < rate < 100 |
| `years` | `number` | Loan term as a positive integer (max 100) |

**Returns:** `AmortizationResult`

| Field | Type | Description |
|---|---|---|
| `monthlyPayment` | `number` | Fixed monthly payment |
| `totalPayments` | `number` | Total number of payments |
| `totalInterest` | `number` | Total interest paid over the life of the loan |
| `schedule` | `AmortizationEntry[]` | Per-payment breakdown |

Each `AmortizationEntry`:

| Field | Type | Description |
|---|---|---|
| `payment` | `number` | Payment number (1-indexed) |
| `principal` | `number` | Principal portion of the payment |
| `interest` | `number` | Interest portion of the payment |
| `remainingBalance` | `number` | Balance remaining after payment |

---

#### AutoLoan

Calculates auto loan payments using the standard amortization formula, with term in months.

```typescript
import { AutoLoan } from "calculators";

const al = new AutoLoan(35000, 5000, 4.5, 60);
// constructor(vehiclePrice, downPayment, ratePercentage, termMonths)
const result = al.calculate();
console.log(result.monthlyPayment); // 559.28
console.log(result.totalInterest);  // 3556.80
```

| Parameter | Type | Description |
|---|---|---|
| `vehiclePrice` | `number` | Vehicle price (must be > 0) |
| `downPayment` | `number` | Down payment (>= 0, must be < price) |
| `ratePercentage` | `number` | Annual rate, 0 < rate < 100 |
| `termMonths` | `number` | Loan term in months (positive integer) |

**Returns:** `AutoLoanResult`

| Field | Type | Description |
|---|---|---|
| `loanAmount` | `number` | Financed amount (price - down payment) |
| `monthlyPayment` | `number` | Monthly payment |
| `totalPaid` | `number` | Total of all payments |
| `totalInterest` | `number` | Total interest paid |

---

#### DebtPayoff

Calculates how long it takes to pay off a debt with a fixed monthly payment.

```typescript
import { DebtPayoff } from "calculators";

const dp = new DebtPayoff(5000, 18, 200);
// constructor(balance, ratePercentage, monthlyPayment)
const result = dp.calculate();
console.log(result.months);        // 32
console.log(result.totalInterest); // 1313.97
```

| Parameter | Type | Description |
|---|---|---|
| `balance` | `number` | Outstanding debt (must be > 0) |
| `ratePercentage` | `number` | Annual rate, 0 < rate < 100 |
| `monthlyPayment` | `number` | Fixed payment (must exceed monthly interest) |

**Returns:** `DebtPayoffResult`

| Field | Type | Description |
|---|---|---|
| `months` | `number` | Number of months to pay off |
| `totalPaid` | `number` | Total amount paid |
| `totalInterest` | `number` | Total interest paid |

---

### Investments & Savings

#### RetirementSavings

Projects the future value of retirement savings with regular contributions.

```typescript
import { RetirementSavings } from "calculators";

const rs = new RetirementSavings(50000, 500, 7, 25);
// constructor(initialBalance, monthlyContribution, ratePercentage, years)
const result = rs.calculate();
console.log(result.futureValue);       // 676,570+ (varies by rounding)
console.log(result.totalContributions); // 150000
console.log(result.totalInterest);      // futureValue - 50000 - 150000
```

| Parameter | Type | Description |
|---|---|---|
| `initialBalance` | `number` | Starting balance (>= 0) |
| `monthlyContribution` | `number` | Monthly contribution (>= 0) |
| `ratePercentage` | `number` | Annual return rate, 0-100 |
| `years` | `number` | Investment horizon (must be > 0) |

**Returns:** `RetirementResult`

| Field | Type | Description |
|---|---|---|
| `futureValue` | `number` | Projected total value |
| `totalContributions` | `number` | Sum of all contributions |
| `totalInterest` | `number` | Total growth from interest |

---

#### PresentValue

Calculates the present value of a future sum: `PV = FV / (1 + r)^n`.

```typescript
import { PresentValue } from "calculators";

const pv = new PresentValue(10000, 5, 10);
// constructor(futureValue, ratePercentage, years)
console.log(pv.calculate()); // 6139.13
```

| Parameter | Type | Description |
|---|---|---|
| `futureValue` | `number` | Future amount (must be > 0) |
| `ratePercentage` | `number` | Discount rate, 0-100 |
| `years` | `number` | Time period (must be > 0) |

**Returns:** `number` — the present value.

---

#### SavingsGoal

Calculates the monthly savings needed to reach a financial goal.

```typescript
import { SavingsGoal } from "calculators";

const sg = new SavingsGoal(50000, 10000, 5, 5);
// constructor(goalAmount, currentSavings, ratePercentage, years)
const result = sg.calculate();
console.log(result.monthlySavings);      // ~588
console.log(result.totalContributions);  // monthlySavings * 60
console.log(result.interestEarned);      // goal - currentSavings - contributions
```

| Parameter | Type | Description |
|---|---|---|
| `goalAmount` | `number` | Target amount (must be > 0) |
| `currentSavings` | `number` | Current savings (>= 0, must be < goal) |
| `ratePercentage` | `number` | Annual return rate, 0-100 |
| `years` | `number` | Time horizon (must be > 0) |

**Returns:** `SavingsGoalResult`

| Field | Type | Description |
|---|---|---|
| `monthlySavings` | `number` | Required monthly savings |
| `totalContributions` | `number` | Total amount contributed |
| `interestEarned` | `number` | Total interest earned |

---

#### DollarCostAveraging

Simulates periodic fixed-amount investments at varying prices.

```typescript
import { DollarCostAveraging } from "calculators";

const prices = [50, 45, 55, 40, 60];
const dca = new DollarCostAveraging(100, prices);
// constructor(investmentPerPeriod, prices)
const result = dca.calculate();
console.log(result.totalShares);
console.log(result.averageCostPerShare);
console.log(result.totalInvested); // 500
```

| Parameter | Type | Description |
|---|---|---|
| `investmentPerPeriod` | `number` | Fixed investment amount (must be > 0) |
| `prices` | `number[]` | Array of prices per period (all must be > 0) |

**Returns:** `DCAResult`

| Field | Type | Description |
|---|---|---|
| `totalInvested` | `number` | Total amount invested |
| `totalShares` | `number` | Total shares purchased |
| `averageCostPerShare` | `number` | Average cost per share |
| `currentValue` | `number` | Value at the final price |
| `gainLoss` | `number` | Dollar gain or loss (currentValue - totalInvested) |

---

#### ROI

Calculates return on investment with optional annualized ROI.

```typescript
import { ROI } from "calculators";

const roi = new ROI(10000, 15000, 3);
// constructor(cost, revenue, years?)
const result = roi.calculate();
console.log(result.roi);           // 50.00
console.log(result.annualizedRoi); // 14.47
console.log(result.netProfit);     // 5000.00
```

| Parameter | Type | Description |
|---|---|---|
| `cost` | `number` | Initial investment (must be > 0) |
| `revenue` | `number` | Total return (>= 0) |
| `years` | `number?` | Optional holding period for annualized ROI |

**Returns:** `ROIResult`

| Field | Type | Description |
|---|---|---|
| `roi` | `number` | ROI as a percentage |
| `annualizedRoi` | `number?` | Annualized ROI (if years provided) |
| `netProfit` | `number` | Revenue minus cost |

---

#### InflationAdjustedReturn

Calculates the real rate of return after inflation using the Fisher equation.

```typescript
import { InflationAdjustedReturn } from "calculators";

const iar = new InflationAdjustedReturn(10, 3);
// constructor(nominalRatePercentage, inflationRatePercentage)
const result = iar.calculate();
console.log(result.realReturn); // 6.80
```

| Parameter | Type | Description |
|---|---|---|
| `nominalRatePercentage` | `number` | Nominal return rate, 0-100 |
| `inflationRatePercentage` | `number` | Inflation rate, 0 to <100 |

**Returns:** `InflationAdjustedResult`

| Field | Type | Description |
|---|---|---|
| `realReturn` | `number` | Real return percentage |
| `nominalRate` | `number` | Input nominal rate |
| `inflationRate` | `number` | Input inflation rate |

---

### Tax & Business

#### TaxBracket

Calculates progressive income tax with bracket breakdown.

```typescript
import { TaxBracket } from "calculators";
import type { Bracket } from "calculators";

const brackets: Bracket[] = [
  { min: 0,     max: 11000,  rate: 10 },
  { min: 11000, max: 44725,  rate: 12 },
  { min: 44725, max: 95375,  rate: 22 },
  { min: 95375, max: 182100, rate: 24 },
];

const tb = new TaxBracket(100000, brackets);
const result = tb.calculate();
console.log(result.totalTax);      // Total tax owed
console.log(result.effectiveRate); // Effective tax rate %
console.log(result.marginalRate);  // Highest applicable bracket rate
console.log(result.brackets);      // Per-bracket breakdown
```

| Parameter | Type | Description |
|---|---|---|
| `income` | `number` | Taxable income (must be > 0) |
| `taxBrackets` | `Bracket[]` | Array of tax brackets (non-overlapping) |

Each `Bracket`:

| Field | Type | Description |
|---|---|---|
| `min` | `number` | Bracket lower bound (>= 0) |
| `max` | `number` | Bracket upper bound (must be > min) |
| `rate` | `number` | Tax rate for this bracket, 0-100 |

**Returns:** `TaxBracketResult`

| Field | Type | Description |
|---|---|---|
| `totalTax` | `number` | Total tax owed |
| `effectiveRate` | `number` | Effective tax rate as a percentage |
| `marginalRate` | `number` | Marginal (highest applicable) tax rate |
| `brackets` | `BracketBreakdown[]` | Per-bracket tax detail |

---

#### BreakEven

Calculates the break-even point in units and revenue.

```typescript
import { BreakEven } from "calculators";

const be = new BreakEven(50000, 100, 60);
// constructor(fixedCosts, pricePerUnit, variableCostPerUnit)
const result = be.calculate();
console.log(result.breakEvenUnits);   // 1250
console.log(result.breakEvenRevenue); // 125000
console.log(result.contributionMargin); // 40
```

| Parameter | Type | Description |
|---|---|---|
| `fixedCosts` | `number` | Total fixed costs (must be > 0) |
| `pricePerUnit` | `number` | Selling price per unit (must be > 0) |
| `variableCostPerUnit` | `number` | Variable cost per unit (>= 0, must be < price) |

**Returns:** `BreakEvenResult`

| Field | Type | Description |
|---|---|---|
| `breakEvenUnits` | `number` | Units to sell to break even (rounded up) |
| `breakEvenRevenue` | `number` | Revenue at break-even point |
| `contributionMargin` | `number` | Price minus variable cost per unit |
| `contributionMarginRatio` | `number` | Contribution margin as a percentage of price |

---

## Scripts

| Command | Description |
|---|---|
| `npm test` | Run all tests with Jest |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm run publish-lib` | Build and publish to npm |
| `npm run publish-beta` | Build and publish with `beta` tag |
| `npm run publish-dryrun` | Build and simulate publish |
| `npm run patch` | Bump patch version |
| `npm run minor` | Bump minor version |
| `npm run major` | Bump major version |

## Testing

The library includes **173 tests** across 15 test suites covering:

- Input validation (boundary values, negative inputs, zero values)
- Mathematical correctness (verified against known financial formulas)
- Edge cases (rounding precision, exact payoff, single-period calculations)
- Safety guards (loop limits, maximum term lengths)

```bash
npm test
```

## Project Structure

```
Calculators/
  app/
    index.ts                  # Library entry point (all exports)
    calculators/
      SimpleInterest.ts
      CompoundInterest.ts
      mortgage.ts
      LoanAmortization.ts
      RetirementSavings.ts
      PresentValue.ts
      DebtPayoff.ts
      ROI.ts
      RuleOf72.ts
      InflationAdjustedReturn.ts
      DollarCostAveraging.ts
      AutoLoan.ts
      SavingsGoal.ts
      BreakEven.ts
      TaxBracket.ts
    __tests__/                # Jest test suites (one per calculator)
  dist/                       # Compiled output (generated)
  tsconfig.json               # Build config (strict mode)
  tsconfig.test.json          # Test config (extends build)
  jest.config.js              # Jest configuration
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-calculator`
3. Write tests first (TDD) in `app/__tests__/`
4. Implement the calculator in `app/calculators/`
5. Export from `app/index.ts`
6. Ensure all tests pass: `npm test`
7. Ensure the build is clean: `npm run build`
8. Submit a pull request

All calculators follow the same pattern:

```typescript
export interface MyCalculatorResult {
  // typed result fields
}

export default class MyCalculator {
  constructor(/* parameters */) { /* assign fields */ }

  _validate() {
    // throw descriptive errors for invalid inputs
  }

  calculate(): MyCalculatorResult {
    this._validate();
    // computation with toFixed(2) rounding
    return { /* result */ };
  }
}
```

## License

[MIT](https://opensource.org/licenses/MIT)
