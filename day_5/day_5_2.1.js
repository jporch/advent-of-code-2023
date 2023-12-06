var fs = require('fs');

fs.readFile('./day_5.dat', 'utf8', (err, data) => {
  let maps = data.split('\r\n\r\n');
  const total = processMaps(maps);

  console.log(`Answer: ${total}`);
});

function processMaps(maps) {
  const startTime = new Date().getTime();
  let total = Number.MAX_SAFE_INTEGER;
  let lookup = new Map();
  let seeds;
  for (map of maps) {
    let label, mapping;
    if (map.split('\n').length == 1) {
      seeds = map.split(' ');
      label = seeds.shift();
      continue;
    } 
    [label, mapping] = map.split(':\r\n');
    mapping = mapping.split('\r\n');
    mapping = new Mapping(mapping);
    lookup.set(label,mapping);
  }
  let count = 0;
  for (let s = 1; s < seeds.length; s+=2) {
    count += parseInt(seeds[s]);
  }
  console.log('Total seeds: ',count);
  let seedsProcessed = 0;
  for (let s = 0; s < seeds.length; s+=2) {
    let minSeed = parseInt(seeds[s]);
    let maxSeed = minSeed + parseInt(seeds[s+1]);
    for (let i = minSeed; i < maxSeed; i++){
      let val = i;
      //console.log(i);
      for ([k, v] of lookup) {
        let oldVal = val;
        val = v.convert(val);
        //if (oldVal !== val) console.log('  ',k,':',oldVal,'-->',val);
      }
      total = Math.min(val, total);
      seedsProcessed++;
      if (seedsProcessed%10000 === 0) console.log(count - seedsProcessed,' to go... (',(new Date().getTime()-startTime)/1000,'s  ',seedsProcessed/count*100,'%)');
    }
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
    let flag = input >= this.source && input < this.end;
    if (flag) {
      //console.log('~~~',this.source, this.end, this.adjustment);
    }
    return flag;
  }

  convert(input) {
    return input - this.adjustment;
  }
}