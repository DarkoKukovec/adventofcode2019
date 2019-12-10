const { combineLatest, of, range } = require('rxjs');
const { map, switchMap, toArray, filter, find } = require('rxjs/operators');
const { parse, programWithVerbs } = require('../../operators');

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
      map(([a, b]) => a.map((x, i) => ({ program: val, params: [x, b[i]] }))),
      switchMap((val) => of(...val)),
    ),
  ),
  programWithVerbs(),
  find(({ program }) => program[0] === 19690720),
  map(({ params }) => 100 * params[0] + params[1]),
];
