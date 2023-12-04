var fs = require('fs');

fs.readFile('./day_3.dat', 'utf8', (err, data) => {
  let total = 0;
  let map = data.split('\r\n');
  for (row in map) {
    map[row] = map[row].split('');
  }
  for (let row = 0; row < map.length; row++) {
    for (let col = 0; col < map[row].length; col++) {
      if (isDigit(map[row][col])) {
        if (isAlreadyHandled(map,row,col)) continue;
        if (isDigit(E(map,row,col))) {
          // New Horizontal number
          total += getHorizontalNumber(map,row,col);
        } else if (isDigit(S(map,row,col))) {
          // New Vertical number
          total += getVerticalNumber(map,row,col);
        } else {
          // New single digit number
          if (adjacentSymbol(map,row,col)) total += parseInt(map[row][col]);
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
//#endregion

//#region Parse Numbers
function getHorizontalNumber(m,r,c) {
  let total = parseInt(m[r][c]);
  let active = adjacentSymbol(m,r,c);
  let offset = 0;
  while (isDigit(E(m,r,c+offset))) {
    offset++;
    total *= 10;
    total += parseInt(m[r][c+offset]);
    active = active || adjacentSymbol(m,r,c+offset);
  }
  return active ? total : 0;
}
function getVerticalNumber(m,r,c) {
  let total = parseInt(m[r][c]);
  let active = adjacentSymbol(m,r,c);
  let offset = 0;
  while (isDigit(S(m,r+offset,c))) {
    offset++;
    total *= 10;
    total += parseInt(m[r][c+offset]);
    active = active || adjacentSymbol(m,r+offset,c);
  }
  return active ? total : 0;
}
//#endregion