var fs = require('fs');
fs.readFile('./day_1.dat', 'utf8', (err, data) => {
  if (err) {
    throw err; 
  }
  let count = 0;
  const lines = data.split('\n');
  lines.forEach((line) => {
    if (line.length < 1) {
      return;
    }
    const digits = line.replace(/\D/g,'').split('');
    const val = (parseInt(digits[0])*10) + (parseInt(digits[digits.length - 1]));
    console.log(val);
    count = count + val;
  });

  console.log(`Answer: ${count}`);
});