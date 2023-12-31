var fs = require('fs');
let partNums = new Map();
let Grid;

fs.readFile('./day_3.dat', 'utf8', (err, data) => {
  Grid = data.split('\r\n');

  let total = 0;
  // Find all gears, determine how many numbers they touch, compute gear ratio
  for (let row = 0; row < Grid.length; row++) {
    for (let col = 0; col < Grid[row].length; col++) {
      let coord = new Coord(row,col);
      if (isGear(coord.value())) {
        const nums = adjacentNumbers(coord);
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


class Coord {
  constructor(row=-1, col=-1) {
    this.row = row;
    this.col = col;
  }
  value() {
    return (this.row >=0 && this.col >= 0) && (this.row < Grid.length && this.col < Grid[this.row].length) ? Grid[this.row][this.col] : '.';
  }

  //#region Access adjacent cells
  NW() {
    if (this.row < 1 || this.col < 1) return new Coord();
    return new Coord(this.row-1,this.col-1);
  }

  N() {
    if (this.row < 1) return new Coord();
    return new Coord(this.row-1,this.col);
  }
  
  NE() {
    if (this.row < 1 || this.col >= Grid[this.row].length-1) return new Coord();
    return new Coord(this.row-1,this.col+1);
  }
  
  SW() {
    if (this.row >= Grid.length-1 || this.col < 1) return new Coord();
    return new Coord(this.row+1,this.col-1);
  }
  
  S() {
    if (this.row >= Grid.length-1) return new Coord();
    return new Coord(this.row+1,this.col);
  }
  
  SE() {
    if (this.row >= Grid.length-1 || this.col >= Grid[this.row].length-1) return new Coord();
    return new Coord(this.row+1,this.col+1);
  }
  
  E() {
    if (this.col >= Grid[this.row].length-1) return new Coord();
    return new Coord(this.row,this.col+1);
  }
  
  W() {
    if (this.col < 1) return new Coord();
    return new Coord(this.row,this.col-1);
  }
  //#endregion
}

//#region Check contents of adjacent cells
function isDigit(char) {
  return /[0-9]/.test(char);
}
function isGear(char) {
  return char === '*';
}
function adjacentNumbers(coord) {
  const numbers = new Set();
  const directions = [coord.NW(), coord.N(), coord.NE(), coord.W(), coord.E(), coord.SW(), coord.S(), coord.SE()];
  for (direction of directions) {
    if (isDigit(direction.value())) {
      numbers.add(getNumberIndex(direction));
    }
  }
  return numbers;
}
//#endregion

//#region Parse Numbers
function getNumber(coord) {
  if (partNums.has(`${coord.row},${coord.col}`)) return partNums.get(`${coord.row},${coord.col}`);
  let total = parseInt(coord.value());
  let newCoord = coord.E();
  while (isDigit(newCoord.value())) {
    total *= 10;
    total += parseInt(newCoord.value());
    newCoord = newCoord.E();
  }
  partNums.set(`${coord.row},${coord.col}`,total);
  return total;
}
function getNumberIndex(coord) {
  let newCoord = new Coord(coord.row, coord.col);
  while (isDigit(newCoord.W().value())) {
    newCoord = newCoord.W();
  }
  const key =  `${newCoord.row},${newCoord.col}`;
  if (!partNums.has(key)) partNums.set(key, getNumber(newCoord));
  return key;
}
//#endregion