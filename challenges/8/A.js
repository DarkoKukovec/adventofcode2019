const { of } = require('rxjs');
const { map, reduce, switchMap, toArray, tap } = require('rxjs/operators');
const { parse } = require('../../operators');

module.exports = [
  parse('', false),
  toArray(),
  switchMap((input) =>
    of(
      input.reduce((groups, curr, index) => {
        const groupIndex = Math.floor(index / (25 * 6));
        groups[groupIndex] = [].concat(groups[groupIndex] || [], curr);
        return groups;
      }, []),
    ).pipe(
      switchMap((groups) =>
        of(...groups).pipe(
          map((group) =>
            group.reduce((count, curr) => {
              count[curr] = count[curr] + 1 || 1;
              return count;
            }, {}),
          ),
        ),
      ),
    ),
  ),
  reduce((min, curr) => (min[0] < curr[0] ? min : curr), { 0: Infinity }),
  map((min) => min[1] * min[2]),
];
