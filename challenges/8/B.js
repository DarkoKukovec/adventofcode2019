const { of } = require('rxjs');
const { map, reduce, switchMap, toArray, tap } = require('rxjs/operators');
const { parse } = require('../../operators');

module.exports = [
  parse(''),
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
          reduce(
            (image, group) => {
              return image.map((pixel, index) =>
                pixel === 2 ? group[index] : pixel,
              );
            },
            Array.from({ length: 25 * 6 }).map(() => 2),
          ),
        ),
      ),
    ),
  ),
  map((image) => {
    const rows = image.reduce((groups, curr, index) => {
      const groupIndex = Math.floor(index / 25);
      groups[groupIndex] = [].concat(groups[groupIndex] || [], curr);
      return groups;
    }, []);
    return (
      '\n' +
      rows
        .map((row) => row.join(''))
        .join('\n')
        .replace(/0/g, ' ')
        .replace(/1/g, '█')
    );
  }),
];
