const fs = require('fs');
const path = require('path');
const { of } = require('rxjs');

function isDirectory(source) {
  return fs.lstatSync(source).isDirectory();
}

function getDirectories(source) {
  return fs
    .readdirSync(source)
    .filter((name) => isDirectory(path.join(source, name)));
}

module.exports = {
  loadData(task) {
    const dataPath = path.join(
      __dirname,
      'challenges',
      task.toString(),
      'input.txt',
    );
    return fs.readFileSync(dataPath, 'utf-8');
  },

  getLatestTask() {
    return getDirectories(path.join(__dirname, 'challenges'))
      .map(Number)
      .sort((a, b) => a - b)
      .pop();
  },

  runTask(taskNumber, variant, input) {
    const taskPath = path.join(
      __dirname,
      'challenges',
      taskNumber.toString(),
      `${variant}.js`,
    );
    if (fs.existsSync(taskPath)) {
      const pipeFns = require(taskPath);
      console.time(variant);
      of(input)
        .pipe(...pipeFns)
        .subscribe(
          (res) => {
            console.timeEnd(variant);
            console.log(`Task ${taskNumber}${variant} result:`, res);
          },
          (e) => {
            console.log(`Task ${taskNumber}${variant} error:`, e);
          },
        );
    }
  },
};
