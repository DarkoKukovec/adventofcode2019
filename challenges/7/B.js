const { combineLatest, of, range, throwError } = require('rxjs');
const {
  filter,
  expand,
  map,
  reduce,
  skip,
  switchMap,
  toArray,
  take,
  tap,
  takeWhile,
  catchError,
  takeLast,
} = require('rxjs/operators');
const { parse, program } = require('../../operators');

module.exports = [
  parse(','),
  toArray(),
  switchMap((code) =>
    range(56789, 41977).pipe(
      // Range from 56789 to 98765
      map((seq) =>
        seq
          .toString()
          .padStart(5, '0')
          .split('')
          .map((val) => parseInt(val, 10)),
      ),
      filter((seq) => Math.min(...seq) > 4),
      filter((seq) => new Set(seq).size === 5),
      take(1),
      tap(console.log),
      expand((seq) => {
        console.log('expand', seq);
        // console.log('seq', seq);
        return combineLatest(
          ...seq.map((item, index) => {
            if (typeof item === 'number') {
              return (index
                ? of([0, code, [item]])
                : of([0, code, [item, 0]])
              ).pipe(program());
            }
            const nextInput = seq[(index - 1 + 5) % 5][3].pop();
            if (nextInput || nextInput === 0) {
              console.log(
                index,
                (index - 1 + 5) % 5,
                seq[(index - 1 + 5) % 5][3],
                // seq.map((s) => s[3]),
              );
              console.log('resume', item[0], item[3], [nextInput]);
              return of([item[0], item[1], [nextInput]]).pipe(program());
            }
            console.log('noops', index);
            return of(item);
          }),
        ).pipe(
          map((items) => {
            console.log('check', items[4][3]);
            return items[4][1] instanceof Array
              ? items
              : throwError(items[4][3].pop());
          }),
          // tap((x) => console.log('combine', x)),
        );
      }),
      catchError((data) => data),
      takeLast(1),
      // skip(1),
      // filter((seq) => typeof seq[0] !== 'number'),
      // tap(console.log),
      // takeWhile((seq) => seq[4][1] instanceof Array, true), // pause has a program as the second param
      // tap((seq) =>
      //   console.log(
      //     'outer',
      //     seq.map((s) => s[3]),
      //   ),
      // ),
      // filter((seq) => typeof seq[0] !== 'number'),
      // takeWhile((seq) => seq.some((s) => s[3].length)),
      // map((seq) => seq[4][3].pop()),
      tap(console.log),
    ),
  ),
  // tap((out) => console.log('out', out)),
  reduce((max, curr) => (max > curr ? max : curr), 0),
];
