var fs = require('fs');
fs.readFile('./day_1.dat', 'utf8', (err, data) => {
  let total = 0;
  const lines = data.split('\r\n');
  for (let line of lines) {
    const digits = line.replace(/\D/g,'').split('');
    total = total + (parseInt(digits[0])*10) + (parseInt(digits[digits.length - 1]));
  };

  console.log(`Answer: ${total}`);
});