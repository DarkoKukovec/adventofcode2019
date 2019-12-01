const { of } = require('rxjs');
const { expand, skip, switchMap, takeWhile } = require('rxjs/operators');
const { parse, sum } = require('../../operators');

module.exports = [
  parse(),
  switchMap((data) =>
    of(data).pipe(
      expand((val) => of(Math.max(0, Math.floor(val / 3) - 2))),
      takeWhile((x) => x > 0),
      skip(1),
    ),
  ),
  sum(),
];
