const { of } = require('rxjs');
const {
  expand,
  map,
  reduce,
  switchMap,
  takeLast,
  takeWhile,
  tap,
} = require('rxjs/operators');

function getValue(program, mode, value, relativeBase) {
  if (mode === '2') {
    return program[relativeBase + value] || 0;
  }
  return mode === '1' ? value : program[value] || 0;
}

function setValue(program, mode, value, data, relativeBase, output) {
  if (mode === '2') {
    program[relativeBase + value] = data;
  } else if (mode === '1') {
    output.push(data);
  } else {
    program[value] = data;
  }
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
          0,
        ]),
        expand(
          ([
            position,
            programOrig,
            [cmdCode, a, b, x],
            inputs,
            outputs,
            relativeBase,
          ]) => {
            console.log('cmd', cmdCode);
            const program = programOrig.slice();
            const [c2 = 0, c1 = 0, mA = 0, mB = 0, mC = 0] = cmdCode
              .toString()
              .split('')
              .reverse();
            const cmd = parseInt(`${c1}${c2}`, 10);
            let newPosition = position;
            console.log('cmdd', cmd);
            if (cmd === 99) {
              return of([program[0], noun, verb, outputs]);
            } else if (cmd === 1) {
              const data =
                getValue(program, mA, a, relativeBase) +
                getValue(program, mB, b, relativeBase);
              setValue(program, mC, x, data, relativeBase, outputs);
              newPosition += 4;
            } else if (cmd === 2) {
              const data =
                getValue(program, mA, a, relativeBase) *
                getValue(program, mB, b, relativeBase);
              setValue(program, mC, x, data, relativeBase, outputs);
              newPosition += 4;
            } else if (cmd === 3) {
              const data = inputs.shift();
              setValue(program, mA, a, data, relativeBase, outputs);
              newPosition += 2;
            } else if (cmd === 4) {
              const data = getValue(program, mA, a, relativeBase);
              outputs.push(data);
              newPosition += 2;
            } else if (cmd === 5) {
              newPosition = getValue(program, mA, a, relativeBase)
                ? getValue(program, mB, b, relativeBase)
                : newPosition + 3;
            } else if (cmd === 6) {
              // console.log('6');
              newPosition = getValue(program, mA, a, relativeBase)
                ? newPosition + 3
                : getValue(program, mB, b, relativeBase);
            } else if (cmd === 7) {
              // console.log('7');
              const data =
                getValue(program, mA, a, relativeBase) <
                getValue(program, mB, b, relativeBase)
                  ? 1
                  : 0;
              setValue(program, mC, x, data, relativeBase, outputs);
              newPosition += 4;
            } else if (cmd === 8) {
              const data =
                getValue(program, mA, a, relativeBase) ===
                getValue(program, mB, b, relativeBase)
                  ? 1
                  : 0;
              setValue(program, mC, x, data, relativeBase, outputs);
              newPosition += 4;
            } else if (cmd === 9) {
              relativeBase += getValue(program, mA, a, relativeBase);
              newPosition += 2;
              // console.log('base', relativeBase, newPosition);
            }
            console.log(
              'step',
              position,
              newPosition,
              cmdCode,
              outputs,
              relativeBase,
              program.length,
              program.slice(newPosition, newPosition + 4),
            );
            return of([
              newPosition,
              program,
              program.slice(newPosition, newPosition + 4),
              inputs.slice(),
              outputs.slice(),
              relativeBase,
            ]);
          },
        ),
        // tap(([_position, program]) => program instanceof Array),
        takeWhile(([_position, program]) => program instanceof Array, true),
        takeLast(1),
      ),
    ),
  programOutput: () => map(([_result, _noun, _verb, output]) => output.pop()),
};
