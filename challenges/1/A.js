const { map } = require('rxjs/operators');
const { parse, sum } = require('../../operators');

module.exports = [
  parse(), // Parse the input into a stream of values
  map((val) => Math.floor(val / 3) - 2),
  sum(), // Sum up all entries
];
