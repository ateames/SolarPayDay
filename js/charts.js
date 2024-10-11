// charts.js

export function generateCharts(data) {
  const yearsArray = [];
  const cumulativeSavingsWithoutTax = [];
  const cumulativeSavingsWithTax = [];

  let cumulativeSavingsNoTax = -data.actualCostWithoutTaxCredit;
  let cumulativeSavingsTax = -data.actualCostWithTaxCredit;
  let annualSavings = data.averageBill * 12;
  let rateIncrease = data.rateIncrease;

  for (let i = 1; i <= data.yearsOwnHome; i++) {
    yearsArray.push(`Year ${i}`);

    cumulativeSavingsNoTax += annualSavings;
    cumulativeSavingsWithoutTax.push(cumulativeSavingsNoTax.toFixed(2));

    cumulativeSavingsTax += annualSavings;
    cumulativeSavingsWithTax.push(cumulativeSavingsTax.toFixed(2));

    annualSavings *= (1 + rateIncrease);
  }

  // Chart Without Tax Credit
  const ctx1 = document.getElementById('chartWithoutTax').getContext('2d');
  new Chart(ctx1, {
    type: 'horizontalBar',
    data: {
      labels: yearsArray,
      datasets: [{
        label: 'Cumulative Savings Without Tax Credit',
        data: cumulativeSavingsWithoutTax,
        backgroundColor: 'rgba(52, 152, 219, 0.5)',
        borderColor: 'rgba(52, 152, 219, 1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        xAxes: [{
          ticks: { beginAtZero: true },
          scaleLabel: {
            display: true,
            labelString: 'Amount ($)'
          }
        }],
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Years'
          }
        }]
      }
    }
  });

  // Chart With Tax Credit
  const ctx2 = document.getElementById('chartWithTax').getContext('2d');
  new Chart(ctx2, {
    type: 'horizontalBar',
    data: {
      labels: yearsArray,
      datasets: [{
        label: 'Cumulative Savings With Tax Credit',
        data: cumulativeSavingsWithTax,
        backgroundColor: 'rgba(39, 174, 96, 0.5)',
        borderColor: 'rgba(39, 174, 96, 1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        xAxes: [{
          ticks: { beginAtZero: true },
          scaleLabel: {
            display: true,
            labelString: 'Amount ($)'
          }
        }],
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Years'
          }
        }]
      }
    }
  });
}

export function initializeCharts() {
  // Any initialization code for charts
}
