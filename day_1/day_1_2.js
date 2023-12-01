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
    // Hacky replacement for words
    // Can't do a naive swap because the letters might overlap
    // Ideally you'd replace the first and last instance of words as digits, 
    // but that would involve Effort 
    line = line.replaceAll('one','o1e');
    line = line.replaceAll('two','t2o');
    line = line.replaceAll('three','t3e');
    line = line.replaceAll('four','f4r');
    line = line.replaceAll('five','f5e');
    line = line.replaceAll('six','s6x');
    line = line.replaceAll('seven','s7n');
    line = line.replaceAll('eight','e8t');
    line = line.replaceAll('nine','n9e');

    const digits = line.replace(/\D/g,'').split('');
    const val = (parseInt(digits[0])*10) + (parseInt(digits[digits.length - 1]));
    count = count + val;
  });

  console.log(`Answer: ${count}`);
});