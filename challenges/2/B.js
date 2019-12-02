const { combineLatest, of, range } = require('rxjs');
const {
  expand,
  map,
  switchMap,
  toArray,
  filter,
  find,
  takeWhile,
  takeLast,
} = require('rxjs/operators');
const { parse } = require('../../operators');

module.exports = [
  parse(','),
  toArray(),
  switchMap((val) =>
    combineLatest(
      range(0, 10000).pipe(
        map((x) => x % 100),
        toArray(),
      ),
      range(0, 10000).pipe(
        map((x) => Math.floor(x / 100)),
        toArray(),
      ),
    ).pipe(
      map(([a, b]) => a.map((x, i) => [val, x, b[i]])),
      switchMap((val) => of(...val)),
    ),
  ),
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
          return of([program[0], noun, verb]);
        }
        program[x] =
          cmd === 1 ? program[a] + program[b] : program[a] * program[b];
        return of([
          position + 4,
          program,
          program.slice(position + 4, position + 8),
        ]);
      }),
      takeWhile(([_position, program]) => program instanceof Array, true),
      takeLast(1),
    ),
  ),
  filter((val) => val.length === 3, true),
  find(([val]) => val === 19690720),
  map(([_, noun, verb]) => 100 * noun + verb),
];
