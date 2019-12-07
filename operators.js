const { of } = require('rxjs');
const {
  expand,
  map,
  reduce,
  switchMap,
  takeLast,
  takeWhile,
} = require('rxjs/operators');

function getValue(program, mode, value) {
  return mode === '1' ? value : program[value];
}

module.exports = {
  parse: (separator = '\n', parseNumber = true) =>
    switchMap((data) =>
      of(...data.split(separator)).pipe(
        map((x) => (parseNumber ? parseInt(x, 10) : x)),
      ),
    ),
  sum: () => reduce((agg, curr) => agg + curr),
  programWithVerbs: () =>
    switchMap(([val, noun, verb]) =>
      of([val, noun, verb]).pipe(
        map(([val, noun, verb]) => [0, [val[0], noun, verb, ...val.slice(3)]]),
        module.exports.program(noun, verb),
      ),
    ),
  program: (noun, verb) =>
    switchMap(([position, val, inputs]) =>
      of([position, val]).pipe(
        map(([position, val]) => [
          position,
          val,
          val.slice(position, position + 4),
          inputs.slice(),
          [], // outputs
        ]),
        expand(
          ([position, programOrig, [cmdCode, a, b, x], inputs, outputs]) => {
            const program = programOrig.slice();
            const [c2 = 0, c1 = 0, mA = 0, mB = 0, mC = 0] = cmdCode
              .toString()
              .split('')
              .reverse();
            const cmd = parseInt(`${c1}${c2}`, 10);
            let newPosition = position;
            if (cmd === 99) {
              return of([program[0], noun, verb, outputs]);
            } else if (cmd === 1) {
              const data = getValue(program, mA, a) + getValue(program, mB, b);
              mC === '1' ? outputs.push(data) : (program[x] = data);
              newPosition += 4;
            } else if (cmd === 2) {
              const data = getValue(program, mA, a) * getValue(program, mB, b);
              mC === '1' ? outputs.push(data) : (program[x] = data);
              newPosition += 4;
            } else if (cmd === 3) {
              const data = inputs.shift();
              mA === '1' ? outputs.push(data) : (program[a] = data);
              newPosition += 2;
            } else if (cmd === 4) {
              const data = getValue(program, mA, a);
              outputs.push(data);
              newPosition += 2;
            } else if (cmd === 5) {
              newPosition = getValue(program, mA, a)
                ? getValue(program, mB, b)
                : newPosition + 3;
            } else if (cmd === 6) {
              newPosition = getValue(program, mA, a)
                ? newPosition + 3
                : getValue(program, mB, b);
            } else if (cmd === 7) {
              const data =
                getValue(program, mA, a) < getValue(program, mB, b) ? 1 : 0;
              mC === '1' ? outputs.push(data) : (program[x] = data);
              newPosition += 4;
            } else if (cmd === 8) {
              const data =
                getValue(program, mA, a) === getValue(program, mB, b) ? 1 : 0;
              mC === '1' ? outputs.push(data) : (program[x] = data);
              newPosition += 4;
            }
            return of([
              newPosition,
              program,
              program.slice(newPosition, newPosition + 4),
              inputs.slice(),
              outputs.slice(),
            ]);
          },
        ),
        takeWhile(([_position, program]) => program instanceof Array, true),
        takeLast(1),
      ),
    ),
};
