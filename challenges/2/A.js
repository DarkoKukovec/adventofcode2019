const { combineLatest, of } = require('rxjs');
const {
  expand,
  map,
  switchMap,
  toArray,
  takeLast,
  takeWhile,
} = require('rxjs/operators');
const { parse } = require('../../operators');

module.exports = [
  parse(','),
  toArray(),
  map((val) => [val, 12, 2]),
  switchMap(([val, noun, verb]) =>
    of([val, noun, verb]).pipe(
      map(([val, noun, verb]) => [0, [val[0], noun, verb, ...val.slice(3)]]),
      map(([position, val]) => [
        position,
        val,
        val.slice(position, position + 4),
      ]),
      expand(([position, program, [cmd, a, b, x]]) => {
        if (cmd === 99) {
          return of(program[0]);
        }
        program[x] =
          cmd === 1 ? program[a] + program[b] : program[a] * program[b];
        return of([
          position + 4,
          program,
          program.slice(position + 4, position + 8),
        ]);
      }),
      takeWhile((val) => val instanceof Array, true),
      takeLast(1),
    ),
  ),
];
