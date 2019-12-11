const { map, toArray } = require('rxjs/operators');
const { parse, interpreter } = require('../../operators');

const dirs = {
  0: [0, 1],
  2: [0, -1],
  3: [-1, 0],
  1: [1, 0],
};

module.exports = [
  parse(','),
  toArray(),
  map((program) => {
    let x = 0;
    let y = 0;
    let dir = 0;
    const hull = {};
    let prog = interpreter()({ program, input: [1] });
    while (prog.type === 'pause') {
      const [color, turn] = prog.output;
      hull[[x, y]] = color;
      dir = (dir + (turn || 3)) % 4;
      x += dirs[dir][0];
      y += dirs[dir][1];
      prog = interpreter()({
        ...prog,
        input: [hull[[x, y]] || 0],
      });
    }
    return hull;
  }),
  map((hull) => {
    const keys = Object.keys(hull).map((key) =>
      key.split(',').map((c) => parseInt(c, 10)),
    );
    const minX = Math.min(...keys.map((key) => key[0]));
    const maxX = Math.max(...keys.map((key) => key[0]));
    const minY = Math.min(...keys.map((key) => key[1]));
    const maxY = Math.max(...keys.map((key) => key[1]));
    let line;
    let writing = '\n';

    for (let y = maxY; y >= minY; y--) {
      line = '';
      for (let x = minX; x <= maxX; x++) {
        const color = hull[[x, y]] || 0;
        line += color ? '█' : ' ';
      }
      writing += line + '\n';
    }
    return writing;
  }),
];
