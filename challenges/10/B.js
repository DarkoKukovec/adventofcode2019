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
          const angleRads = Math.atan2(dY, dX);
          const angle = ((angleRads * 180) / Math.PI + 360) % 360;
          list[angle] = list[angle] || [];
          list[angle].push([...a, Math.sqrt(dX ** 2 + dY ** 2)]);
          return list;
        }, {}),
    ]),
  ),
  map((asteroids) => ({
    all: asteroids,
    center: asteroids.reduce((max, item) =>
      Object.keys(item[2]).length > Object.keys(max[2]).length ? item : max,
    ),
  })),
  map((field) => ({
    all: field.all,
    center: [
      ...field.center.slice(0, 2),
      Object.keys(field.center[2]).reduce(
        (map, key) => ({
          ...map,
          [key]: field.center[2][key].sort((a, b) => a[2] - b[2]),
        }),
        {},
      ),
      Object.keys(field.center[2]).sort((a, b) => a - b),
      Object.keys(field.center[2])
        .sort((a, b) => a - b)
        .findIndex((x) => x >= 270),
    ],
  })),
  map((field) => {
    let count = 0;
    let index = field.center[4];
    while (count < field.all.length - 1) {
      const key = field.center[3][index];
      if (field.center[2][key].length) {
        count++;
        const next = field.center[2][key].shift();
        if (count === 200) {
          return next;
        }
      }
      index = (index + 1) % field.center[3].length;
    }
  }),
  map((target) => 100 * target[0] + target[1]),
];
