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
  let values = [];
  let mappings = [];
  for await (const line of rl) {
    if (!line) continue;
    if (line === 'seed-to-soil map:') continue;
    if (line.startsWith('seeds: ')) {
      values = line.match(/\d+/g).map(str => Number.parseInt(str))
      continue
    }
    if (line.endsWith('map:')) {
      // perform the previous mapping
      values = applyMapping(values, mappings)
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
  console.log({values})
  values = applyMapping(values, mappings)
  console.log('==========')
  // console.log(sum)
  console.log({values})
  console.log({mappings})
  console.log(values.sort((v1, v2) => v1 - v2)[0])
}

main();
