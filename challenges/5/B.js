const { map, toArray } = require('rxjs/operators');
const { parse, program } = require('../../operators');

module.exports = [
  parse(','),
  toArray(),
  map((val) => [0, val]),
  program([5])(),
  map(([_result, _noun, _verb, output]) => output.pop()),
];
