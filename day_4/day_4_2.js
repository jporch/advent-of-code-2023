var fs = require('fs');

fs.readFile('./day_4.dat', 'utf8', (err, data) => {
  let lines = data.split('\r\n');
  const total = processLines(lines);

  console.log(`Answer: ${total}`);
});

function processLines(lines) {
  let total = 0;
  let multiplier = new Array(lines.length).fill(1);
  let game = 0;
  for (let line of lines) {
    let val = 0;
    const winnersSet = new Set();
    [winners, picks] =  line.replaceAll('  ',' ').split(': ')[1].split(' | ');
    for (winner of winners.split(' ')) {
      winnersSet.add(winner);
    }
    picks = picks.split(' ');
    for (pick of picks) {
      if (winnersSet.has(pick)) val++;
    }
    for (;val > 0; val--) multiplier[game+val] += multiplier[game];
    total += multiplier[game];
    game++;
  }
  return total;
}