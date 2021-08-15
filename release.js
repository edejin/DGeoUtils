const fs = require('fs');
const {exec} = require('child_process');

const args = process.argv.slice(2);

const [type] = args;

const path = './package.json';

const readVersion = () => {
  const data = fs.readFileSync(path);
  const info = JSON.parse(data);
  return [
    info,
    info.version.split('.').map(Number)
  ];
};

const writeVersion = (info, numbers) => {
  info.version = numbers.join('.');
  fs.writeFileSync(path, JSON.stringify(info, null, 2));
};

const commit = (numbers) => {
  exec(`git add ${path} -A`, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    exec(`git commit -m "Release ${numbers.join('.')}"`);
  });
};

switch (type) {
  case 'fix': {
    const [info, numbers] = readVersion();
    numbers[2] += 1;
    writeVersion(info, numbers);
    commit(numbers);
  }
    break;
  case 'minor': {
    const [info, numbers] = readVersion();
    numbers[2] = 0;
    numbers[1] += 1;
    writeVersion(info, numbers);
    commit(numbers);
  }
    break;
  case 'major': {
    const [info, numbers] = readVersion();
    numbers[2] = 0;
    numbers[1] = 0;
    numbers[0] += 1;
    writeVersion(info, numbers);
    commit(numbers);
  }
    break;
  default:
    console.log('Unknown type');
}
