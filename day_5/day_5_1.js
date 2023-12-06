var fs = require('fs');

fs.readFile('./day_5.dat', 'utf8', (err, data) => {
  let maps = data.split('\r\n\r\n');
  const total = processMaps(maps);

  console.log(`Answer: ${total}`);
});

function processMaps(maps) {
  let total = Number.MAX_SAFE_INTEGER;
  let lookup = new Map();
  let seeds;
  for (map of maps) {
    let label, mapping;
    if (map.split('\n').length == 1) {
      seeds = map.split(' ');
      label = seeds.shift();
      seeds = seeds.sort();
      continue;
    } 
    [label, mapping] = map.split(':\r\n');
    mapping = mapping.split('\r\n');
    mapping = new Mapping(mapping);
    lookup.set(label,mapping);
  }
  for (seed of seeds) {
    let val = seed;
    for ([k, v] of lookup) {
      val = v.convert(val);
    }
    total = Math.min(val, total);
  }
  return total;
}

class Mapping {
  constructor(ranges) {
    this.intervals = [];
    for (let r in ranges) {
      ranges[r] = ranges[r].split(' ');
      this.intervals.push(new Interval(...ranges[r]));
    }
    this.intervals.sort( (a,b) => {return a.source - b.source});
    this.min = this.intervals[0].source;
    this.max = this.intervals[this.intervals.length-1].end;
  }

  convert(input) {
    if (input < this.min || input > this.max) return input;
    for (const interval of this.intervals) {
      if (interval.includes(input)) {
        return interval.convert(input);
      }
    }
    return input;
  }
}

class Interval {
  constructor(destination, source, length) {
    this.source = parseInt(source);
    this.adjustment = this.source - parseInt(destination);
    this.end = this.source+parseInt(length);
  }

  includes(input) {
    return input >= this.source && input <= this.end;
  }

  convert(input) {
    return input - this.adjustment;
  }
}