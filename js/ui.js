// ui.js

import {
  calculateTaxCredit,
  calculateTotalCostWithTaxCredit,
  calculateCostPerWatt,
  calculateMonthlyPayment,
  calculateTotalInterest,
  calculateActualCost,
  calculatePayback,
  calculatePaybackOverLifetime,
} from './calculations.js';

import { generateCharts } from './charts.js';

export function initializeUI() {
  setupEventListeners();
}

function setupEventListeners() {
  const calculateButton = document.getElementById('calculate-btn');
  calculateButton.addEventListener('click', handleCalculateClick);
}

function handleCalculateClick() {
  // Fetch Inputs
  const systemCost = parseFloat(document.getElementById('systemCost').value);
  const systemSize = parseFloat(document.getElementById('systemSize').value);
  const averageBill = parseFloat(document.getElementById('averageBill').value);
  const rateIncrease = parseFloat(document.getElementById('rateIncrease').value) / 100 || 0.03;
  const taxCreditPercent = parseFloat(document.getElementById('taxCredit').value) / 100;
  const yearsOwnHome = parseInt(document.getElementById('yearsOwnHome').value);

  const downPayment = parseFloat(document.getElementById('downPayment').value);
  const interestRate = parseFloat(document.getElementById('interestRate').value) / 100;
  const loanTermYears = parseInt(document.getElementById('loanTerm').value);

  // Validate Inputs
  if (!validateInputs({
    systemCost,
    systemSize,
    averageBill,
    rateIncrease,
    taxCreditPercent,
    yearsOwnHome,
    downPayment,
    interestRate,
    loanTermYears,
  })) {
    return;
  }

  // Perform Calculations
  const taxCreditAmount = calculateTaxCredit(systemCost, taxCreditPercent);
  const totalCostWithTaxCredit = calculateTotalCostWithTaxCredit(systemCost, taxCreditAmount);
  const costPerWattNoTaxCredit = calculateCostPerWatt(systemCost, systemSize).toFixed(2);
  const costPerWattWithTaxCredit = calculateCostPerWatt(totalCostWithTaxCredit, systemSize).toFixed(2);

  const loanAmountWithoutTaxCredit = systemCost - downPayment;
  const loanAmountWithTaxCredit = totalCostWithTaxCredit - downPayment;

  const monthlyPaymentWithoutTaxCredit = calculateMonthlyPayment(loanAmountWithoutTaxCredit, interestRate, loanTermYears);
  const monthlyPaymentWithTaxCredit = calculateMonthlyPayment(loanAmountWithTaxCredit, interestRate, loanTermYears);

  const totalInterestWithoutTaxCredit = calculateTotalInterest(monthlyPaymentWithoutTaxCredit, loanTermYears, loanAmountWithoutTaxCredit);
  const totalInterestWithTaxCredit = calculateTotalInterest(monthlyPaymentWithTaxCredit, loanTermYears, loanAmountWithTaxCredit);

  const actualCostWithoutTaxCredit = calculateActualCost(systemCost, totalInterestWithoutTaxCredit);
  const actualCostWithTaxCredit = calculateActualCost(totalCostWithTaxCredit, totalInterestWithTaxCredit);

  const actualCostPerWattWithoutTaxCredit = calculateCostPerWatt(actualCostWithoutTaxCredit, systemSize).toFixed(2);
  const actualCostPerWattWithTaxCredit = calculateCostPerWatt(actualCostWithTaxCredit, systemSize).toFixed(2);

  const paybackInfoWithoutTax = calculatePayback(systemCost, averageBill, rateIncrease);
  const paybackInfoWithTax = calculatePayback(totalCostWithTaxCredit, averageBill, rateIncrease);

  const paybackOverLifetimeWithoutTax = calculatePaybackOverLifetime(systemCost, averageBill, rateIncrease, yearsOwnHome);
  const paybackOverLifetimeWithTax = calculatePaybackOverLifetime(totalCostWithTaxCredit, averageBill, rateIncrease, yearsOwnHome);

  // Display Results
  displayResults({
    taxCreditAmount,
    totalCostWithTaxCredit,
    costPerWattNoTaxCredit,
    costPerWattWithTaxCredit,
    monthlyPaymentWithoutTaxCredit,
    monthlyPaymentWithTaxCredit,
    totalInterestWithoutTaxCredit,
    totalInterestWithTaxCredit,
    actualCostWithoutTaxCredit,
    actualCostWithTaxCredit,
    actualCostPerWattWithoutTaxCredit,
    actualCostPerWattWithTaxCredit,
    paybackInfoWithoutTax,
    paybackInfoWithTax,
    paybackOverLifetimeWithoutTax,
    paybackOverLifetimeWithTax,
  });

  // Generate Charts
  generateCharts({
    actualCostWithoutTaxCredit,
    actualCostWithTaxCredit,
    averageBill,
    rateIncrease,
    yearsOwnHome,
  });
}

function displayResults(data) {
  const resultsDiv = document.getElementById('results-display');
  resultsDiv.innerHTML = `
    <p><strong>Est. Tax Credit Amount:</strong> $${data.taxCreditAmount.toFixed(2)}</p>
    <p><strong>Total Cost w/ Tax Credit:</strong> $${data.totalCostWithTaxCredit.toFixed(2)}</p>
    <p><strong>Cost per Watt No Tax Credit:</strong> $${data.costPerWattNoTaxCredit}</p>
    <p><strong>Cost per Watt w/ Tax Credit:</strong> $${data.costPerWattWithTaxCredit}</p>
    <p><strong>Monthly Payments w/o Tax Credit:</strong> $${data.monthlyPaymentWithoutTaxCredit.toFixed(2)}</p>
    <p><strong>Monthly Payments w/ Tax Credit:</strong> $${data.monthlyPaymentWithTaxCredit.toFixed(2)}</p>
    <p><strong>Total Loan Interest w/o Tax Credit:</strong> $${data.totalInterestWithoutTaxCredit.toFixed(2)}</p>
    <p><strong>Total Loan Interest w/ Tax Credit:</strong> $${data.totalInterestWithTaxCredit.toFixed(2)}</p>
    <p><strong>Actual Cost w/o Tax Credit:</strong> $${data.actualCostWithoutTaxCredit.toFixed(2)}</p>
    <p><strong>Actual Cost w/ Tax Credit:</strong> $${data.actualCostWithTaxCredit.toFixed(2)}</p>
    <p><strong>Actual Cost per W w/o Tax Credit Applied:</strong> $${data.actualCostPerWattWithoutTaxCredit}</p>
    <p><strong>Actual Cost per W w/ Tax Credit Applied:</strong> $${data.actualCostPerWattWithTaxCredit}</p>
    <p><strong>Payback w/o Tax Credit:</strong> ${data.paybackInfoWithoutTax.years} years and ${data.paybackInfoWithoutTax.months} months</p>
    <p><strong>Payback w/ Tax Credit:</strong> ${data.paybackInfoWithTax.years} years and ${data.paybackInfoWithTax.months} months</p>
    <p><strong>Payback Over Lifetime w/o Tax Credit:</strong> $${data.paybackOverLifetimeWithoutTax}</p>
    <p><strong>Payback Over Lifetime w/ Tax Credit:</strong> $${data.paybackOverLifetimeWithTax}</p>
  `;
}

function validateInputs(inputs) {
  for (const [key, value] of Object.entries(inputs)) {
    if (isNaN(value) || value < 0) {
      alert(`Please enter a valid number for ${formatFieldName(key)}.`);
      return false;
    }
  }
  return true;
}

function formatFieldName(fieldName) {
  return fieldName
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase());
}
