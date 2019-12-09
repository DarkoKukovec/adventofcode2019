const { map, toArray } = require('rxjs/operators');
const { parse, program, programOutput } = require('../../operators');

module.exports = [
  parse(','),
  toArray(),
  map((val) => [0, val, [5]]),
  program(),
  programOutput(),
];
