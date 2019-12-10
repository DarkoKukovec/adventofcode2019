const { of, range } = require('rxjs');
const { filter, map, reduce, switchMap, toArray } = require('rxjs/operators');
const { parse, interpreter } = require('../../operators');

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
      switchMap((seq) => {
        let programs = seq.map((item, index) =>
          interpreter()({ program: code, input: index ? [item] : [item, 0] }),
        );
        while (programs[4].type === 'pause') {
          programs = programs.map((item, index) => {
            const prevIndex = (index - 1 + 5) % 5;
            const nextInput = programs[prevIndex].output.slice(-1)[0];
            if (nextInput || nextInput === 0) {
              programs[prevIndex].output = [];
              return interpreter()({ ...item, input: [nextInput] });
            }
            return item;
          });
        }
        return of(programs);
      }),
    ),
  ),
  map((programs) => programs[4].output.slice(-1)[0]),
  reduce((max, curr) => (max > curr ? max : curr), 0),
];
