const { sum } = require('../../utils');

module.exports = (input) =>
  input
    .split('\n')
    .map((val) => Math.floor(val / 3) - 2)
    .reduce(sum);
