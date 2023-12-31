const assert = require('assert')
const fs = require('fs')
const readline = require('readline')
const path = require('path')
const lib = require('../lib/lib')
const _ = require('lodash')

// const inputFilePath = 'input-test.txt'
const inputFilePath = 'input.txt'
const muteFlags = [true, true, false, ]

async function coreFunction(data) {
  let result = -1

  await recordOutput([data], result)
  return result
}

function findBrickMaxes(bricks) {
  return bricks.reduce((max, brick) => {
    return [
      Math.max(max[0], brick[1][0]),
      Math.max(max[1], brick[1][1]),
      Math.max(max[2], brick[1][2]),
    ]
  }, [0, 0, 0])
}

function findBrickMins(bricks) {
  return bricks.reduce((min, brick) => {
    return [
      Math.min(min[0], brick[0][0]),
      Math.min(min[1], brick[0][1]),
      Math.min(min[2], brick[0][2]),
    ]
  }, [Infinity, Infinity, Infinity])
}

function fallDown(bricks, checkFall = false) {
  // let unsettledBricks = _.cloneDeep(bricks)
  unsettledBricks = [...bricks]
  //
  let settledBricks = []
  let settledMax = Array(maxes[0] + 1).fill(true).map(_ => Array(maxes[1] + 1).fill(0))
  while (unsettledBricks.length) {
    // // seach for lowest unsettledBricks
    // const lowestBricks = unsettledBricks.reduce((lowest, brick) => {
    //   return brick[0][2] < lowest[0][2] ? brick : lowest
    // }, unsettledBricks[0])
    // // pick it out
    // unsettledBricks = unsettledBricks.filter(b => b !== lowestBricks)

    const lowestBricks = unsettledBricks.shift()

    // fall down
    // search for max settledMax within range
    let fallingZ = 0
    for (let x = lowestBricks[0][0]; x <= lowestBricks[1][0]; ++x) {
      for (let y = lowestBricks[0][1]; y <= lowestBricks[1][1]; ++y) {
        fallingZ = Math.max(settledMax[x][y], fallingZ)
      }
    }
    // TODO: reduce height
    const zDiff = lowestBricks[0][2] - fallingZ - 1
    debugLog1({fallingZ, zDiff})
    assert(zDiff >= 0)
    if (zDiff) {
      if (checkFall) {
        //throw new Error('really have to fall!!')
        return true
      }
      lowestBricks[0][2] -= zDiff
      lowestBricks[1][2] -= zDiff
    }
    // update settledMax
    for (let x = lowestBricks[0][0]; x <= lowestBricks[1][0]; ++x) {
      for (let y = lowestBricks[0][1]; y <= lowestBricks[1][1]; ++y) {
        settledMax[x][y] = lowestBricks[1][2]
      }
    }
    debugLog1(lib.mapToHash(settledMax))
    // add to settle
    settledBricks.push(lowestBricks)
  }
}

let maxes

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

  // const lines = fs.readFileSync(process.stdin.fd).toString().replace('\r', '').split("\n");

  // debugLog({lines})

  let bricks = lines.map(line => {
    return line.split('~').map(posStr => {
      // FIXME: asset first point is less than second point
      return posStr.split(',').map(s => Number.parseInt(s))
    })
  }).sort((b0, b1) => b0[0][2] - b1[0][2])
  // debugLog(JSON.stringify(bricks))

  maxes = findBrickMaxes(bricks)
  debugLog('maxes', JSON.stringify(maxes))

  fallDown(bricks)

  let sum = 0
  for (let brick of bricks) {
    let newBricks = bricks.filter(b => b !== brick)
    // newBricks = _.cloneDeep(newBricks)
    if (!fallDown(newBricks, true)) {
      ++sum
    }
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
