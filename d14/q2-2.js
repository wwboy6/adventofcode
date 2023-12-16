const fs = require('fs')
const readline = require('readline');
const path = require('path')
const { rFact, compareObject } = require('../lib/lib');
const _ = require('lodash')

// const inputFilePath = 'input-test.txt'
const inputFilePath = 'input.txt'
const muteFlags = [false, false, false, ]
// const muteFlags = [true, true, true, ]

function stringToData(hash) {
  return hash.split('\n').map(line => line.split(''))
}

function dataToString(data) {
  return data.map(line => line.join('')).join('\n')
}

function weight(data) {
  const lineCount = data.length
  let sum = 0;
  for (let y = 0; y < data.length; ++y) {
    const lineWeight = lineCount - y
    sum += data[y].filter(c => c === 'O').length * lineWeight
  }
  return sum
}

function slide(data) {
  const width = data[0].length
  for (let y = 1; y < data.length; ++y) {
    for (let x = 0; x < width; ++x) {
      if (data[y][x] !== 'O') continue;
      // search for upper space
      let resultY = y
      for (let ty = y - 1; ty >= 0; --ty) {
        if (data[ty][x] !== '.') break
        resultY = ty
      }
      // roll
      data[y][x] = '.'
      data[resultY][x] = 'O'
    }
  }
  // TODO: anti transform data for dir
}

function rotate(data) {
  return _.zip(...data.reverse())
}

async function coreFunction(data) {
  const result = data;

  // await recordOutput([data], result)
  return result
}

const runCycle = _.memoize(hash => {
  let data = stringToData(hash)
  for (let dir = 0; dir < 4; ++dir) {
    slide(data) // slide
    data = rotate(data)
  }
  return { hash: dataToString(data) , data }
});

async function main () {
  const file = fs.createReadStream(path.resolve(__dirname, inputFilePath))
  const rl = readline.createInterface({
    input: file,
    crlfDelay: Infinity,
  })

  let data = []
  for await (const line of rl) {
    data.push(line.split(''))
  }

  // const cycleCount = 3
  const cycleCount = 1000000000
  let result
  let hash = dataToString(data)

  for (let cycle = 0; cycle < cycleCount; ++cycle) {
    if (cycle % 10000 === 0) console.log({
      cycle
    })
    if (runCycle.cache.has(hash)) {
      console.log({
        cycle
      })
      // data = cycleCache[hash]
      // continue
      // TODO: resolve loop!!
      let targetHash = hash
      for (loopCount = 1; true; ++loopCount) {
        targetHash = runCycle(targetHash).hash
        if (targetHash === hash) break
      }
      debugLog({loopCount})
      // jump cycle
      let lastCycleCount = (cycleCount - cycle) % loopCount
      debugLog({lastCycleCount})
      let cache = runCycle(hash)
      // TODO:
      for (let c = 0; c < lastCycleCount - 1; ++c) {
        cache = runCycle(cache.hash)
      }
      data = cache.data
      break;
    }
    
    const response = runCycle(hash)
    hash = response.hash
    data = response.data
  }

  // debugLog(dataToString(data));
  result = weight(data)


  console.log('====')
  // console.log({sum})
  console.log({result})

}


// ===========================

const outputFileName = `${path.basename (__filename).split('.')[0]}.txt`

function debugLog(...args) {
  _debugLog(0, ...args)
}

function debugLog1(...args) {
  _debugLog(1, ...args)
}

function debugLog2(...args) {
  _debugLog(2, ...args)
}

function _debugLog(flagI, ...args) {
  if (muteFlags[flagI]) return
  console.log.apply(null, args)
}

let outputFile
async function recordOutput(args, output) {
  if (!outputFile) outputFile = await fs.promises.open(path.resolve(__dirname, outputFileName), 'w')
  await outputFile.appendFile(`${JSON.stringify({ args, output })}\n`)
}

// ===========================

main();

module.exports = {
  coreFunction,
}
