const { map, toArray, tap } = require('rxjs/operators');
const { parse } = require('../../operators');

module.exports = [
  parse('\n', false),
  map((row) => row.split('')),
  toArray(),
  map((field) =>
    [].concat(
      ...field.map((row, y) =>
        row.map((point, x) => (point === '#' ? [x, y] : null)).filter(Boolean),
      ),
    ),
  ),
  map((asteroids) =>
    asteroids.map((item, index) => [
      ...item,
      asteroids
        .filter((_, i) => i !== index)
        .reduce((list, a) => {
          const dX = a[0] - item[0];
          const dY = a[1] - item[1];
          list.add(Math.atan2(dY, dX));
          return list;
        }, new Set()).size,
    ]),
  ),
  map((asteroids) =>
    asteroids.reduce((max, item) => (item[2] > max[2] ? item : max)),
  ),
  map((max) => max[2]),
];
