const { map } = require('rxjs/operators');
const { parse, sum } = require('../../operators');

module.exports = [
  parse(),
  map((val) => {
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
