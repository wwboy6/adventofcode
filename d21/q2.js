const fs = require('fs')
const readline = require('readline')
const path = require('path')
const lib = require('../lib/lib')
const _ = require('lodash')
const { subscribe } = require('diagnostics_channel')

// const inputFilePath = 'input-test.txt'
// const totalCount = 7

const inputFilePath = 'input.txt'
const totalCount = 26501365

const muteFlags = [true, true, false, ]

async function coreFunction(data) {
  let result = -1

  await recordOutput([data], result)
  return result
}

const directions = [
  { x: -1, y: 0 },
  { x: 1, y: 0 },
  { x: 0, y: 1 },
  { x: 0, y: -1 },
]

function prcocessOneStep(emptyMap, positions, previousPosition) {
  const newPositions = {}
  for (let y in positions) {
    y = Number.parseInt(y)
    for (let x of positions[y]) {
      const pos = {x, y}
      //
      for (let dir of directions) {
        const newPos = lib.v2Add(pos, dir)
        //
        const value = lib.getMap(emptyMap, newPos)
        // TODO: ignore out of map checking
        if (!value) continue
        if (value !== '.') continue
        if (!previousPosition[`${newPos.y}`]) previousPosition[`${newPos.y}`] = new Set()
        if (previousPosition[`${newPos.y}`].has(newPos.x)) continue
        if (!newPositions[`${newPos.y}`]) newPositions[`${newPos.y}`] = new Set()
        if (newPositions[`${newPos.y}`].has(newPos.x)) continue
        //
        newPositions[`${newPos.y}`].add(newPos.x)
      }
    }
  }
  return newPositions
}

function printPositions(emptyMap, positions) {
  let str = ''
  for (let y = 0; y < mapHeight; ++y) {
    for (let x = 0; x < mapWidth; ++x) {
      str += positions[''+y] && positions[''+y].has(x) ? 'O' : emptyMap[y][x]
    }
    str += '\n'
  }
  debugLog(str)
}

function countPositions(positions) {
  return Object.values(positions).reduce((sumEven, xs) => {
    return sumEven + xs.size
  }, 0)
}

function processMap(emptyMap, positions, previousPosition, totalCount) {
  positions = _.cloneDeep(positions)
  previousPosition = _.cloneDeep(previousPosition)
  let sumEven = countPositions(positions)
  let sumOdd = 0
  let subSum
  let step
  for (step = 0; step < totalCount; ++step) {
    // if (step % 2 === 0) debugLog1({ step, subSum })
    const isEvenStep = step % 2 === 1
    // positions = prcocessOneStep(maps, emptyMap, positions, isEvenStep ? 'X' : 'O')
    const newPositions = prcocessOneStep(emptyMap, positions, previousPosition)
    previousPosition = positions
    positions = newPositions
    subSum = countPositions(positions)

    // short cut for whole map is filled
    if (!subSum) break

    if (isEvenStep) {
      sumEven += subSum
    } else {
      sumOdd += subSum
    }
  }
  return {sumEven, sumOdd, stepsToFull: step}
}

function sumRepeatingParts(emptyMap, positions, totalCount, loopStart, isCorner) {
  if (totalCount < loopStart) return 0
  let sum = 0
  let previousPosition = {}
  // preparing to determine the fill up case
  let { sumEven, sumOdd, stepsToFull } = processMap(emptyMap, positions, previousPosition, Infinity)
  debugLog1({sumEven, sumOdd, stepsToFull})
  // sum up result for each levels
  let level = 1
  for (let firstStepForSubMap = loopStart; firstStepForSubMap <= totalCount; firstStepForSubMap += mapWidth) {
    let subSum
    const localStepCount = totalCount - firstStepForSubMap
    const localEven = localStepCount % 2 === 0
    if (localStepCount < stepsToFull) {
      // process for un-filled case
      let {sumEven: subSumEven, sumOdd: subSumOdd} = processMap(emptyMap, positions, previousPosition, localStepCount)
      debugLog1({subSumEven, subSumOdd})
      subSum = localEven ? subSumEven : subSumOdd
    } else {
      // shortcut for filled case
      subSum = localEven ? sumEven : sumOdd
    }
    // debugLog1({ i, subSum })
    if (isCorner) {
      sum += level * subSum
    } else {
      sum += subSum
    }
    ++level
  }
  debugLog1({ sum })
  return sum
}

let mapWidth
let mapHeight 
let halfMapWidth

async function main () {
  const filePath = path.resolve(__dirname, inputFilePath)

  // const file = fs.createReadStream(filePath)
  // const rl = readline.createInterface({
  //   input: file,
  //   crlfDelay: Infinity,
  // })
  // for await (const line of rl) {
  // }

  const dataStr = await fs.promises.readFile(filePath, 'utf8')

  const lines = dataStr.replace('\r', '').split('\n')
  let map = lines.map(line => line.replace('S', '.').split(''))
  // debugLog({map})
  let emptyMap = _.cloneDeep(map)

  let pos
  for (let y = 0; y < lines.length; ++y) {
    const x = lines[y].indexOf('S')
    if (x >= 0) {
      pos = {x, y}
      break
    }
  }
  debugLog({ pos })
  // this is an object of hashed y with set of hashed x
  // to optimize the checking if a point is already
  // in this data
  let positions = { [pos.y]: new Set([ pos.x ]) }
  let previousPosition = {}

  // let maps = {
  //   '0|0': map
  // }
  let sum = 0
  mapWidth = emptyMap[0].length;
  mapHeight = emptyMap.length;
  halfMapWidth = (mapWidth - 1) / 2
  debugLog({ mapWidth, mapHeight, halfMapWidth })

  // after many steps, divide the whole picture into sub-maps
  // classify them into and 8 cases
  // here is the Top half of the whole picture
  //           _ 
  //          |U|
  //         . . .
  //      UL   U   UR
  //   .       .       .
  //  _        _        _ 
  // |L| ..L. |S| .R.. |R|
  //  .        .        .
  //
  // all sub-maps "orthogornal" to the starting one are
  // Up (U), Left (L), Right (R), Bottom (B) - 4 cases
  // each of them would start having their first step
  // at the middle of one edge (lower edge for the case of U)
  //
  // all other sub-maps are "corner" cases,
  // UL (Upper Left), UR, BL, BR - 4 cases
  // each of them would start having their first step
  // at the corner of the map
  // the are further divided into different "level"
  // w.r.t. steps required that they would be reached
  // first level involve 1 map for each case
  // second level invole 2 maps for each case, and so on:
  //
  //     ... 3 U ...
  //   ... 3 2 U ...
  // ... 3 2 1 U ...
  // ... L L L S ...
  //
  // this algorithm would first calculate reqired step to make
  // the first step of the sub-map, then calculate the "local steps"
  // for each submap, run through "processMap", and get the answer
  // w.r.t. the local step is odd or even
  //
  // the function "sumRepeatingParts" would first determine the step
  // required to fully fill up the sub-map, and shortcut the result
  // for fully filled cases

  debugLog('center')
  // case center
  {
    let { sumEven, sumOdd } = processMap(emptyMap, positions, previousPosition, totalCount)
    debugLog({sumEven, sumOdd})
    sum += totalCount % 2 === 0 ? sumEven : sumOdd
  }

  debugLog('orthgonal')
  // case left, right, up, down
  let startPositions = [
    { x: mapWidth - 1, y: halfMapWidth},
    { x: 0, y: halfMapWidth},
    { x: halfMapWidth, y: mapHeight - 1},
    { x: halfMapWidth, y: 0},
  ]
  for (let pos of startPositions) {
    positions = { [pos.y]: new Set([ pos.x ]) }
    sum += sumRepeatingParts(emptyMap, positions, totalCount, halfMapWidth + 1)
  }

  debugLog('corner')
  // case ul, ur, bl, br
  startPositions = [
    { x: mapWidth - 1, y: mapHeight - 1},
    { x: mapWidth - 1, y: 0},
    { x: 0, y: mapHeight - 1},
    { x: 0, y: 0},
  ]
  for (let pos of startPositions) {
    positions = { [pos.y]: new Set([ pos.x ]) }
    sum += sumRepeatingParts(emptyMap, positions, totalCount, (halfMapWidth + 1) * 2, true)
  }

  console.log('====')
  console.log({sum})

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
