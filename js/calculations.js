// calculations.js

export function calculateTaxCredit(systemCost, taxCreditPercent) {
  return systemCost * taxCreditPercent;
}

export function calculateTotalCostWithTaxCredit(systemCost, taxCreditAmount) {
  return systemCost - taxCreditAmount;
}

export function calculateCostPerWatt(totalCost, systemSize) {
  return totalCost / (systemSize * 1000);
}

export function calculateMonthlyPayment(principal, annualRate, years) {
  const monthlyRate = annualRate / 12;
  const n = years * 12;
  return (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -n));
}

export function calculateTotalInterest(monthlyPayment, loanTermYears, principal) {
  return (monthlyPayment * loanTermYears * 12) - principal;
}

export function calculateActualCost(systemCost, totalInterest) {
  return systemCost + totalInterest;
}

export function calculatePayback(totalCost, averageBill, rateIncrease) {
  let cumulativeSavings = 0;
  let annualSavings = averageBill * 12;
  let years = 0;

  while (cumulativeSavings < totalCost) {
    cumulativeSavings += annualSavings;
    annualSavings *= (1 + rateIncrease);
    years++;
    if (years > 50) break; // Avoid infinite loops
  }

  const months = Math.ceil(((totalCost - cumulativeSavings + annualSavings) / annualSavings) * 12);
  return { years, months };
}

export function calculatePaybackOverLifetime(totalCost, averageBill, rateIncrease, yearsOwnHome) {
  let cumulativeSavings = -totalCost;
  let annualSavings = averageBill * 12;

  for (let i = 0; i < yearsOwnHome; i++) {
    cumulativeSavings += annualSavings;
    annualSavings *= (1 + rateIncrease);
  }

  return cumulativeSavings.toFixed(2);
}

export function initializeCalculations() {
  // Any initialization code for calculations
}
