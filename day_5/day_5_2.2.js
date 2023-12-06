/* Backwards Traversal:
   Invert every interval and then traverse the mappings backwards (location -> seed)
   Check if the seed number you arrive at exists within the range of seeds to test

   This makes the problem scale off what the actual answer will be,
   rather than the number of seeds to check, but for any reasonable
   set of potential values should be better overall.
*/

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

fs.readFile('./day_5.dat', 'utf8', (err, data) => {
  let maps = data.split('\r\n\r\n');
  const startTime = new Date().getTime();
  const total = processMaps(maps);
  console.log('Total time: ',(new Date().getTime()-startTime)/1000,'s');

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
      continue;
    } 
    [label, mapping] = map.split(':\r\n');
    mapping = mapping.split('\r\n');
    mapping = new Mapping(mapping);
    lookup.set(label,mapping);
  }

  let count = 0;
  let seedIntervals = [];
  for (let s = 0; s < seeds.length; s+=2) {
    count += parseInt(seeds[s+1]);
    seedIntervals.push(`${seeds[s]} ${seeds[s]} ${seeds[s+1]}`);
  }
  seedIntervals = new Mapping(seedIntervals);
  console.log('Total seeds: ',count);

  let seedsProcessed = 0;
  for (let i = 0; i < Number.MAX_SAFE_INTEGER; ++i) {
    let val = i;
    for (p in phases) {
      val = lookup.get(phases[p]).convert(val);
    }
    if (seedIntervals.includes(val)) return i;
    total = Math.min(val, total);
    seedsProcessed++;
    if (i%100000 === 0) console.log(`Checking ${i}...`);
  }
  return -1;
}

class Mapping {
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