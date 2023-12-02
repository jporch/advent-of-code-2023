var fs = require('fs');

const colorMax = { red: 12, blue: 14, green: 13, }

function checkSets(sets) {
  for (const set of sets) {
    const blocks = set.split(', ');
    for (let block of blocks) {
      let [ num, color ] = block.split(' ');
      if (num > colorMax[color]) return 0;
    }
  }
  return 1;
}

fs.readFile('./day_2.dat', 'utf8', (err, data) => {
  let total = 0;
  const lines = data.split('\r\n');
  for (let line of lines) {
    line = line.split(': ');
    const game = parseInt(line.shift().replace(/\D/g,''));
    const sets = line[0].split('; ');
    total += game * checkSets(sets);
  };

  console.log(`Answer: ${total}`);
});