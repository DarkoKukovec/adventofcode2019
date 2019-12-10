const { map, toArray } = require('rxjs/operators');
const { parse, programWithVerbs } = require('../../operators');

module.exports = [
  parse(','),
  toArray(),
  map((val) => ({ program: val, params: [12, 2] })),
  programWithVerbs(),
  map(({ program }) => program[0]),
];
