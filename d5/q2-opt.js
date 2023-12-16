const fs = require('fs')
const readline = require('readline');
const path = require('path')

function applyMapping(value, mappings) {
  const mapping = mappings.find(m => m.fromStart <= value && m.fromStart + m.count > value )
  if (!mapping) return value
  return value - mapping.fromStart + mapping.toStart
}

function backMapping(value, mappings) {
  const mapping = mappings.find(m => m.toStart <= value && m.toStart + m.count > value)
  if (mapping) {
    return value - mapping.toStart + mapping.fromStart
  } else {
    const cv = applyMapping(value, mappings)
    if (value !== cv) {
      return -1
    }
    return value
  }
}

async function main () {
  const file = fs.createReadStream(path.resolve(__dirname, 'input.txt'))
  const rl = readline.createInterface({
    input: file,
    crlfDelay: Infinity,
  })
  // let sum = 0
  let ranges;
  let seedSets = [];
  let mappings = [];
  let mappingLevels = [];
  for await (const line of rl) {
    if (!line) continue;
    if (line === 'seed-to-soil map:') continue;
    if (line.startsWith('seeds: ')) {
      ranges = line.match(/\d+/g).map(str => Number.parseInt(str))
      for (let i = 0; i < ranges.length / 2; ++i) {
        seedSets.push({
          from: ranges[i * 2],
          to: ranges[i * 2] + ranges[i * 2 + 1] - 1
        })
      }
      continue
    }
    if (line.endsWith('map:')) {
      // perform the previous mapping
      // values = applyMapping(values, mappings)
      mappingLevels.push(mappings)
      // clear mapping
      mappings = [];
      continue
    }
    // construct mapping
    const [toStart, fromStart, count] = line.match(/\d+/g)
    mappings.push({
      fromStart: Number.parseInt(fromStart),
      toStart: Number.parseInt(toStart),
      count: Number.parseInt(count),
    })
  }
  mappingLevels.push(mappings)
  
  let min = Infinity
  for (let mli = -1; mli < mappingLevels.length - 1; ++mli) {
    let seeds = []
    if (mli < 0) {
      // search for all lower boundaries of all seed sets
      seeds = seedSets.map(set => set.from)
      console.log('minSeed', seeds)
    } else {
      // search for all lower boundaries of all mappings
      const mappings = mappingLevels[mli]
      // const backMappingLevels = mappingLevels.slice(0, mli).inver
      for (const mapping of mappings) {
        let v = mapping.fromStart
        // check if it can be traced back to seed
        for (let mli2 = mli - 1; mli2 >= 0; --mli2) {
          v = backMapping(v, mappingLevels[mli2])
          if (v < 0) break
        }
        if (v >= 0) {
          if (seedSets.some(set => v >= set.from && v <= set.to)) seeds.push(v)
        }

        v = mapping.fromStart + mapping.count
        console.log('check v2', v)
        for (let mli2 = mli - 1; mli2 >= 0; --mli2) {
          v = backMapping(v, mappingLevels[mli2])
          if (v < 0) break
        }
        if (v >= 0) {
          if (seedSets.some(set => v >= set.from && v <= set.to)) seeds.push(v)
        }
      }
      console.log('min map', seeds)
    }
    if (!seeds.length) continue
    // trace to location
    const values = seeds.map(v => mappingLevels.reduce(applyMapping, v))
    min = Math.min(min, ...values)
  }
  console.log(min)
}

main();
