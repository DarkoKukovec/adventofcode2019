const { map, toArray } = require('rxjs/operators');
const { parse, program, programOutput } = require('../../operators');

module.exports = [
  parse(','),
  toArray(),
  map((val) => ({ program: val, input: [1] })),
  program(),
  programOutput(),
];
