const { of, range } = require('rxjs');
const { filter, map, reduce, switchMap, toArray } = require('rxjs/operators');
const { parse, program, programOutput } = require('../../operators');

module.exports = [
  parse(','),
  toArray(),
  switchMap((code) =>
    range(1234, 41977).pipe(
      // Range from 01234 to 43210
      map((seq) =>
        seq
          .toString()
          .padStart(5, '0')
          .split('')
          .map((val) => parseInt(val, 10)),
      ),
      filter((seq) => Math.max(...seq) < 5),
      filter((seq) => new Set(seq).size === 5),
      switchMap((seq) =>
        of(...seq).pipe(
          reduce(
            (input2$, input1) =>
              input2$.pipe(
                map((input2) => [0, code, [input1, input2]]),
                program(),
                programOutput(),
              ),
            of(0),
          ),
          switchMap((obs) => obs),
        ),
      ),
    ),
  ),
  reduce((max, curr) => (max > curr ? max : curr), 0),
];
