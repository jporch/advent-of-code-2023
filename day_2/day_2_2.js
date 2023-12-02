var fs = require('fs');
fs.readFile('./day_2.dat', 'utf8', (err, data) => {
  const lines = data.split('\r\n');
  console.log(`Answer: ${processLines(lines)}`);
});

function processLines(lines) {
  let total = 0;
  for (let line of lines) {
    line = line.split(': ');
    const game = parseInt(line.shift().replace(/\D/g,''));
    const sets = line[0].split('; ');
    total += checkSets(sets);
  };
  return total;
}

function computePower(colorMax) {
  let val = 1;
  for (const [key, value] of Object.entries(colorMax)) { val *= value; }
  return val;
}

function checkSets(sets) {
  let colorMax = { red: 1, blue: 1, green: 1, }

  for (const set of sets) {
    const blocks = set.split(', ');
    for (let block of blocks) {
      let [ num, color ] = block.split(' ');
      if (parseInt(num) > colorMax[color]) colorMax[color] = parseInt(num); 
    }
  }

  return computePower(colorMax);
}