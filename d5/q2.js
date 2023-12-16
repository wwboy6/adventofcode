const fs = require('fs')
const readline = require('readline');
const path = require('path')

function applyMapping(values, mappings) {
  return values.map(value => {
    const mapping = mappings.find(m => m.fromStart <= value && m.fromStart + m.count > value )
    if (!mapping) return value
    return value - mapping.fromStart + mapping.toStart
  })
}

async function main () {
  const file = fs.createReadStream(path.resolve(__dirname, 'input.txt'))
  const rl = readline.createInterface({
    input: file,
    crlfDelay: Infinity,
  })
  // let sum = 0
  let ranges;
  let values = [];
  let mappings = [];
  let mappingLevels = [];
  for await (const line of rl) {
    if (!line) continue;
    if (line === 'seed-to-soil map:') continue;
    if (line.startsWith('seeds: ')) {
      ranges = line.match(/\d+/g).map(str => Number.parseInt(str))
      // for (let i = 0; i < ranges.length / 2; ++i) {
      //   for (let j = 0; j < ranges[i * 2 + 1]; ++j) {
      //     values.push(ranges[i * 2] + j)
      //   }
      // }
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
  /*
  console.log({values})
  values = applyMapping(values, mappings)
  console.log('==========')
  // console.log(sum)
  console.log({values})
  console.log({mappings})
  console.log(values.sort((v1, v2) => v1 - v2)[0])
  */

  /*
  let min = Infinity;
  for (let i = 0; i < ranges.length / 2; ++i) {
    let values = []
    for (let j = 0; j < ranges[i * 2 + 1]; ++j) {
      let v = ranges[i * 2] + j;
      values.push(v)
    }
    for (const mappings of mappingLevels) {
      values = applyMapping(values, mappings)
      const sortedValues = values.sort((v1, v2) => v1 - v2)
      console.log('sortedValues', sortedValues[0], sortedValues[sortedValues.length - 1])
      v = sortedValues[0]
    }
    if (v < min) min = v
  }
  console.log(min)
  */
  // const trace = [];
  for (let i = 55716176; true; ++i) {
    let v = i;
    for (let mi = mappingLevels.length - 1; mi >= 0; --mi) {
      const mappings = mappingLevels[mi]
      // back trace the previous level
      const mapping = mappings.find(m => m.toStart <= v && m.toStart + m.count > v)
      if (mapping) {
        // trace.unshift({
        //   mapping,
        //   from: v - mapping.toStart + mapping.fromStart,
        //   to: v,
        // })
        v = v - mapping.toStart + mapping.fromStart
      } else {
        // check if v is valid
        const [cv] = applyMapping([v], mappings)
        if (v !== cv) {
          v = -1
          break
        }
        // trace.unshift({
        //   mapping: null,
        //   from: v,
        //   to: v,
        // })
      }
    }
    if (v < 0) continue
    // check if v is in seed
    for (let index = 0; index < ranges.length / 2; ++index) {
      start = ranges[index * 2]
      count = ranges[index * 2 + 1]
      if (v >= start && v < start + count) {
        console.log({i, v, start, end: start + count })
        // console.log(trace)
        return
      }
    }
  }
}

main();
