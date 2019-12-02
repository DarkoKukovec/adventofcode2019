const { of } = require('rxjs');
const {
  expand,
  map,
  reduce,
  switchMap,
  takeLast,
  takeWhile,
} = require('rxjs/operators');

module.exports = {
  parse: (separator = '\n', parseNumber = true) =>
    switchMap((data) =>
      of(...data.split(separator)).pipe(
        map((x) => (parseNumber ? parseInt(x, 10) : x)),
      ),
    ),
  sum: () => reduce((agg, curr) => agg + curr),
  programWithVerbs: () =>
    switchMap(([val, noun, verb]) =>
      of([val, noun, verb]).pipe(
        map(([val, noun, verb]) => [0, [val[0], noun, verb, ...val.slice(3)]]),
        module.exports.program(noun, verb),
      ),
    ),
  program: (noun, verb) =>
    switchMap(([position, val]) =>
      of([position, val]).pipe(
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
};
