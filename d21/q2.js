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
        // //
        // let xx = newPos.x % mapWidth
        // if (xx < 0) xx += mapWidth
        // let yy = newPos.y % mapHeight
        // if (yy < 0) yy += mapHeight
        // const pp = {x: xx, y: yy}
        // const value = lib.getMap(emptyMap, pp)
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
  let i
  for (i = 0; i < totalCount; ++i) {
    // if (i % 2 === 0) debugLog1({ i, subSum })
    const isEvenStep = i % 2 === 1
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
  return {sumEven, sumOdd, stepsToFull: i - 1}
}

function sumLinearRepeatingParts(emptyMap, positions, totalCount, loopStart, isScalingUp) {
  if (totalCount < loopStart) return 0
  const totalCountIsEven = totalCount % 2 === 0
  let sum = 0
  let previousPosition = {}
  let { sumEven, sumOdd, stepsToFull } = processMap(emptyMap, positions, previousPosition, Infinity)
  debugLog1({sumEven, sumOdd, stepsToFull})
  let level = 1
  for (let i = loopStart; i <= totalCount; i += mapWidth) {
    let subSum
    if (loopStart === totalCount) {
      subSum = 1
    } else {
      const isEvenStart = i % 2 === 0
      const localStepCount = totalCount - i

      if (localStepCount < stepsToFull) {
        let {sumEven: subSumEven, sumOdd: subSumOdd} = processMap(emptyMap, positions, previousPosition, localStepCount)
        debugLog1({subSumEven, subSumOdd})
        subSum = !(isEvenStart ^ totalCountIsEven) ? subSumEven : subSumOdd
      } else {
        subSum = !(isEvenStart ^ totalCountIsEven) ? sumEven : sumOdd
      }
    }
    // debugLog1({ i, subSum })
    if (isScalingUp) {
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

  debugLog('center')
  // case center
  {
    let { sumEven, sumOdd } = processMap(emptyMap, positions, previousPosition, totalCount)
    debugLog({sumEven, sumOdd})
    sum += totalCount % 2 === 0 ? sumEven : sumOdd
  }

  debugLog('linear')
  // case left, right, up, down
  let startPositions = [
    { x: mapWidth - 1, y: halfMapWidth},
    { x: 0, y: halfMapWidth},
    { x: halfMapWidth, y: mapHeight - 1},
    { x: halfMapWidth, y: 0},
  ]
  for (let pos of startPositions) {
    positions = { [pos.y]: new Set([ pos.x ]) }
    sum += sumLinearRepeatingParts(emptyMap, positions, totalCount, halfMapWidth + 1)
  }

  debugLog('scaling')
  // case ul, ur, bl, br
  startPositions = [
    { x: mapWidth - 1, y: mapHeight - 1},
    { x: mapWidth - 1, y: 0},
    { x: 0, y: mapHeight - 1},
    { x: 0, y: 0},
  ]
  for (let pos of startPositions) {
    positions = { [pos.y]: new Set([ pos.x ]) }
    sum += sumLinearRepeatingParts(emptyMap, positions, totalCount, (halfMapWidth + 1) * 2, true)
  }


  // let sum = Object.values(maps).reduce((sum, map) => {
  //   return sum + map.reduce((sum2, line) => {
  //     return sum2 + line.filter(c => c === 'O').length
  //   }, 0)
  // }, 0)

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
