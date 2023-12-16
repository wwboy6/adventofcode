const fs = require('fs')
const readline = require('readline');
const path = require('path')
const { rFact, compareObject } = require('../lib/lib');

// const inputFilePath = 'input-test.txt'
const inputFilePath = 'input.txt'
const muteFlags = [false, false, false, ]
// const muteFlags = [true, true, true, ]

function weight(data) {
  const lineCount = data.length
  let sum = 0;
  for (let y = 0; y < data.length; ++y) {
    const lineWeight = lineCount - y
    sum += data[y].filter(c => c === 'O').length * lineWeight
  }
  return sum
}

function dataToString(data) {
  return data.map(line => line.join('')).join('\n')
}

const slideCache = {}
function slide(data) {
  const hash = dataToString(data)
  if (slideCache[hash]) return slideCache[hash]
  //
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

  // TODO:
  // slideCache[hash] = data.map(line => [...line])
  // TODO: anti transform data for dir
}

const rotateCache = {}
function rotate(data) {
  const hash = dataToString(data)
  if (rotateCache[hash]) return rotateCache[hash]
  //
  const newData = []
  const lineCount = data.length
  const width = data[0].length
  for (let y = 0; y < width; ++y) {
    const newLine = []
    for (let x = 0; x < lineCount; ++x) {
      newLine.push(data[lineCount - x - 1][y])
    }
    newData.push(newLine)
  }
  // TODO:
  // rotateCache[hash] = newData.map(line => [...line])
  return newData
}

async function coreFunction(data) {
  slide(data)
  const result = data;

  // await recordOutput([data], result)
  return result
}

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
  const cycleCache = {}
  for (let cycle = 0; cycle < cycleCount; ++cycle) {
    const hash = dataToString(data)
    if (cycle % 10000 === 0) console.log({
      cycle,
      rotateCache: Object.keys(rotateCache).length,
      slideCache: Object.keys(slideCache).length,
      cycleCache: Object.keys(cycleCache).length,
    })
    if (cycleCache[hash]) {
      console.log({
        cycle,
        rotateCache: Object.keys(rotateCache).length,
        slideCache: Object.keys(slideCache).length,
        cycleCache: Object.keys(cycleCache).length,
      })
      // data = cycleCache[hash]
      // continue
      // TODO: resolve loop!!
      let targetHash = hash
      for (loopCount = 1; true; ++loopCount) {
        targetHash = cycleCache[targetHash].to
        if (targetHash === hash) break
      }
      debugLog({loopCount})
      // jump cycle
      let lastCycleCount = (cycleCount - cycle) % loopCount
      debugLog({lastCycleCount})
      let cache = cycleCache[hash]
      // TODO:
      for (let c = 0; c < lastCycleCount - 1; ++c) {
        cache = cycleCache[cache.to]
      }
      data = cache.data
      break;
    }
    for (let dir = 0; dir < 4; ++dir) {
      coreFunction(data) // slide
      data = rotate(data)
      // debugLog(data.map(line => line.join('')).join('\n'));
      // debugLog("===")

    }
    //
    // debugLog({result})
    // debugLog("===")
    cycleCache[hash] = {
      to: dataToString(data),
      data: data.map(line => [...line])
    }
    // debugLog({cycle})
    // debugLog(dataToString(data))
    // debugLog("=====")
  }

  debugLog(dataToString(data));
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
