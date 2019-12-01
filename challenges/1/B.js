const { of } = require('rxjs');
const {
  catchError,
  expand,
  filter,
  skip,
  switchMap,
  throwError,
} = require('rxjs/operators');
const { parse, sum } = require('../../operators');

module.exports = [
  parse('\n', true),
  switchMap((data) =>
    of(data).pipe(
      expand((val) => (val < 1 ? throwError() : of(Math.floor(val / 3) - 2))),
      catchError(() => of(0)),
      filter((x) => x > 0),
      skip(1),
    ),
  ),
  sum(),
];
