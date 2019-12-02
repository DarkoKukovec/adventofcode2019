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
      map(([a, b]) => a.map((x, i) => [val, x, b[i]])),
      switchMap((val) => of(...val)),
    ),
  ),
  programWithVerbs(),
  filter((val) => val.length === 3, true),
  find(([val]) => val === 19690720),
  map(([_, noun, verb]) => 100 * noun + verb),
];
