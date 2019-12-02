const { map, toArray } = require('rxjs/operators');
const { parse, programWithVerbs } = require('../../operators');

module.exports = [
  parse(','),
  toArray(),
  map((val) => [val, 12, 2]),
  programWithVerbs(),
  map(([result]) => result),
];
