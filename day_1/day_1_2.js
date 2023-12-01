var fs = require('fs');
fs.readFile('./day_1.dat', 'utf8', (err, data) => {
  let total = 0;
  const lines = data.split('\r\n');
  for (let line of lines) {
    // Hacky replacement for words
    // Can't do a naive swap because the letters might overlap
    // Ideally you'd replace the first and last instance of words as digits, 
    // but that would involve Effort 
    const swapNums = {
      'one':'o1e',
      'two':'t2o',
      'three':'t3e',
      'four':'4',
      'five':'5e',
      'six':'6',
      'seven':'7n',
      'eight':'e8t',
      'nine':'n9e',
    };
    for (const [num, rep] of Object.entries(swapNums)) {
      line = line.replaceAll(num,rep);
    };
    const digits = line.replace(/\D/g,'').split('');
    total = total + (parseInt(digits[0])*10) + (parseInt(digits[digits.length - 1]));
  };

  console.log(`Answer: ${total}`);
});