const { map } = require('rxjs/operators');

const dirs = {
  U: [0, 1],
  D: [0, -1],
  L: [-1, 0],
  R: [1, 0],
};

module.exports = [
  map((input) => {
    const [a, b] = input.split('\n').map((wire) => wire.split(','));
    const map = { '0,0': 0 };
    let posX = 0;
    let posY = 0;
    let steps = 0;
    const cross = [];

    a.forEach((move) => {
      const dir = move[0];
      const dist = parseInt(move.slice(1), 10);
      const [dirX, dirY] = dirs[dir];
      for (let i = 1; i <= dist; i++) {
        const x = posX + dirX * i;
        const y = posY + dirY * i;
        const key = [x, y].join(',');
        if (map[key] === undefined) {
          map[key] = steps + i;
        }
      }
      posX += dirX * dist;
      posY += dirY * dist;
      steps += dist;
    });

    posX = 0;
    posY = 0;
    steps = 0;

    b.forEach((move) => {
      const dir = move[0];
      const dist = parseInt(move.slice(1), 10);
      [dirX, dirY] = dirs[dir];
      for (let i = 1; i <= dist; i++) {
        const x = posX + dirX * i;
        const y = posY + dirY * i;
        const key = [x, y].join(',');
        if (map[key] !== undefined) {
          cross.push(map[key] + steps + i);
        }
      }
      posX += dirX * dist;
      posY += dirY * dist;
      steps += dist;
    });

    return Math.min(...cross);
  }),
];
