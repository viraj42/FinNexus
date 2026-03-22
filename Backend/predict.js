const regression = require('regression');

// Example monthly expense totals
const data = [
  [1, 25000],
  [2, 27000],
  [3, 24000],
  [4, 30000],
  [5, 29000],
];

// Perform linear regression
const result = regression.linear(data);

// Predict for next month
const nextMonthIndex = data.length + 1;  // 6th month prediction

const prediction = result.predict(nextMonthIndex)[1];

console.log("Predicted next month expense:", prediction);
