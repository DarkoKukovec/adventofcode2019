const { parse, sum, mapItems } = require('../../utils');

module.exports = [
  parse(),
  mapItems((val) => {
    let mass = val,
      sum = 0;
    do {
      mass = Math.floor(mass / 3) - 2;
      sum += Math.max(0, mass);
    } while (mass > 0);
    return sum;
  }),
  sum(),
];
