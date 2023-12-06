var fs = require('fs');

const phases = [
  'seed-to-soil map',
  'soil-to-fertilizer map',
  'fertilizer-to-water map',
  'water-to-light map',
  'light-to-temperature map',
  'temperature-to-humidity map',
  'humidity-to-location map',
].reverse();

fs.readFile('./day_5_simple.dat', 'utf8', (err, data) => {
  let maps = data.split('\r\n\r\n');
  const startTime = new Date().getTime();
  const total = processMaps(maps);
  console.log('Total time: ',(new Date().getTime()-startTime)/1000,'s');

  console.log(`Answer: ${total}`);
});

function processMaps(maps) {
  let total = Number.MAX_SAFE_INTEGER;
  let mapping = new Mapping();
  let seeds;
  for (map of maps) {
    let label, layer;
    if (map.split('\n').length == 1) {
      seeds = map.split(' ');
      label = seeds.shift();
      continue;
    } 
    [label, layer] = map.split(':\r\n');
    layer = layer.split('\r\n');
    layer = new Layer(layer);
    mapping.add(label,layer);
  }

  let count = 0;
  let seedIntervals = [];
  for (let s = 0; s < seeds.length; s+=2) {
    count += parseInt(seeds[s+1]);
    seedIntervals.push(`${seeds[s]} ${seeds[s]} ${seeds[s+1]}`);
  }
  seedIntervals = new Layer(seedIntervals);
  console.log('Total seeds: ',count);

  let seedsProcessed = 0;
  for (let i = 0; i < Number.MAX_SAFE_INTEGER; ++i) {
    let val = mapping.convert(i, phases);
    if (seedIntervals.includes(val)) return i;
    total = Math.min(val, total);
    seedsProcessed++;
    if (i%100000 === 0) console.log(`Checking ${i}...`);
  }
  return -1;
}

class Mapping {
  constructor() {
    this.layers = new Map();
  }

  add(label, layer) {
    this.layers.set(label,layer);
  }

  convert(input, transitions) {
    for (let t in transitions) {
      input = this.layers.get(transitions[t]).convert(input);
    }
    return input;
  }
}

class Layer {
  constructor(ranges) {
    this.intervals = [];
    for (let r in ranges) {
      ranges[r] = ranges[r].split(' ');
      this.intervals.push(new Interval(...ranges[r]));
    }
    this.intervals.sort( (a,b) => {return a.start - b.start});
    this.min = this.intervals[0].start;
    this.max = this.intervals[this.intervals.length-1].end;
  }

  includes(input) {
    if (input < this.min || input >= this.max) return false;
    for (let i in this.intervals) {
      if (this.intervals[i].includes(input)) return true;
    }
    return false;
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
  constructor(source, destination, length) {
    this.start = parseInt(source);
    this.end = this.start+parseInt(length);
    this.adjustment = this.start - parseInt(destination);
  }

  includes(input) {
   return input >= this.start && input < this.end;
  }

  convert(input) {
    return input - this.adjustment;
  }
}