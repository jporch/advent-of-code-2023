var fs = require('fs');

fs.readFile('./day_3.dat', 'utf8', (err, data) => {
  let map = data.split('\r\n');
  let partNums = new Map();
  for (row in map) {
    map[row] = map[row].split('');
  }
  // Build a list of all numbers by their starting point
  for (let row = 0; row < map.length; row++) {
    for (let col = 0; col < map[row].length; col++) {
      if (isDigit(map[row][col])) {
        if (isAlreadyHandled(map,row,col)) continue;
        partNums.set(`${row},${col}`,getNumber(map,row,col));
      }
    }
  };

  let total = 0;
  // Find all gears, determine how many numbers they touch, compute gear ratio
  for (let row = 0; row < map.length; row++) {
    for (let col = 0; col < map[row].length; col++) {
      if (isGear(map[row][col])) {
        const nums = adjacentNumbers(map,row,col);
        if (nums.size === 2) {
          let val = 1;
          for (num of nums) {
            val *= partNums.get(num);
          }
          total += val;
        }
      }
    }
  };
  console.log(`Answer: ${total}`);
});

//#region Access adjacent cells
function NW(map, row, col) {
  if (row < 1 || col < 1) return '.';
  return map[row-1][col-1];
}

function N(map, row, col) {
  if (row < 1) return '.';
  return map[row-1][col];
}

function NE(map, row, col) {
  if (row < 1 || col >= map[row].length-1) return '.';
  return map[row-1][col+1];
}

function SW(map, row, col) {
  if (row >= map.length-1 || col < 1) return '.';
  return map[row+1][col-1];
}

function S(map, row, col) {
  if (row >= map.length-1) return '.';
  return map[row+1][col];
}

function SE(map, row, col) {
  if (row >= map.length-1 || col >= map[row].length-1) return '.';
  return map[row+1][col+1];
}

function E(map, row, col) {
  if (col >= map[row].length-1) return '.';
  return map[row][col+1];
}

function W(map, row, col) {
  if (col < 1) return '.';
  return map[row][col-1];
}
//#endregion

//#region Check contents of adjacent cells
function isDigit(char) {
  return /[0-9]/.test(char);
}
function isSymbol(char) {
  if (char == '.') return false;
  if (isDigit(char)) return false;
  return true;
}
function isGear(char) {
  return char == '*';
}
function isAlreadyHandled(m,r,c) {
  return isDigit(N(m,r,c)) || isDigit(W(m,r,c));
}
function adjacentSymbol(m,r,c) {
  return isSymbol(NW(m,r,c))
  || isSymbol(N(m,r,c))
  || isSymbol(NE(m,r,c))
  || isSymbol(W(m,r,c))
  || isSymbol(E(m,r,c))
  || isSymbol(SW(m,r,c))
  || isSymbol(S(m,r,c))
  || isSymbol(SE(m,r,c))
}
function adjacentNumbers(m,r,c) {
  const numbers = new Set();

  if (isDigit(NW(m,r,c))) {
    numbers.add(getNumberIndex(m,r-1,c-1));
  }
  if (isDigit(N(m,r,c))) {
    numbers.add(getNumberIndex(m,r-1,c));
  }
  if (isDigit(NE(m,r,c))) {
    numbers.add(getNumberIndex(m,r-1,c+1));
  }
  if (isDigit(W(m,r,c))) {
    numbers.add(getNumberIndex(m,r,c-1));
  }
  if (isDigit(E(m,r,c))) {
    numbers.add(getNumberIndex(m,r,c+1));
  }
  if (isDigit(SW(m,r,c))) {
    numbers.add(getNumberIndex(m,r+1,c-1));
  }
  if (isDigit(S(m,r,c))) {
    numbers.add(getNumberIndex(m,r+1,c));
  }
  if (isDigit(SE(m,r,c))) {
    numbers.add(getNumberIndex(m,r+1,c+1));
  }

  return numbers;
}
//#endregion

//#region Parse Numbers
function getNumber(m,r,c) {
  let total = parseInt(m[r][c]);
  let offset = 0;
  while (isDigit(E(m,r,c+offset))) {
    offset++;
    total *= 10;
    total += parseInt(m[r][c+offset]);
  }
  return total;
}
function getNumberIndex(m,r,c) {
  let offset = 0;
  while (isDigit(W(m,r,c-offset))) {
    offset++;
  }
  return `${r},${c-offset}`;
}
//#endregion