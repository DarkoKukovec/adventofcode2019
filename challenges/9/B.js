const { map, toArray } = require('rxjs/operators');
const { parse, program, programOutput } = require('../../operators');

module.exports = [
  parse(','),
  toArray(),
  map((program) => ({ program, input: [2] })),
  program(),
  programOutput(),
];
