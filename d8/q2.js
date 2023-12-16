const fs = require('fs')
const readline = require('readline');
const path = require('path')
function findPathLen(loc, steps, map) {
  let stepI = 0;
  let i = 1
  for (i = 1; true; ++i) {
    const step = steps[stepI]
    loc = map[loc][step]
    if (loc.match(/Z$/)) break;
    // console.log({step, loc})
    stepI = (stepI + 1) % steps.length
  }
  return i
}
async function main () {
  // const file = fs.createReadStream(path.resolve(__dirname, 'input-test.txt'))
  const file = fs.createReadStream(path.resolve(__dirname, 'input.txt'))
  const rl = readline.createInterface({
    input: file,
    crlfDelay: Infinity,
  })
  let sum = 0;
  let readingSteps = true;
  let steps;
  const map = {}
  let locs = []
  for await (const line of rl) {
    if (readingSteps) {
      steps = [...line.match(/\w/g)]
      readingSteps = false
      continue
    }
    if (!line) continue
    const [ _, key, L, R ] = line.match(/(\w+) = \((\w+), (\w+)\)/)
    map[key] = {
      L, R
    }
    if (key.match(/A$/)) locs.push(key)
  }
  console.log({locs})
  const pathLens = locs.map(loc => findPathLen(loc, steps, map))
  console.log('==========')
  console.log({ pathLens })
}

main();
