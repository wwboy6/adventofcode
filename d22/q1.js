const fs = require('fs')
const readline = require('readline')
const path = require('path')
const lib = require('../lib/lib')
const _ = require('lodash')

const inputFilePath = 'input-test.txt'
// const inputFilePath = 'input.txt'
const muteFlags = [false, false, false, ]

async function coreFunction(data) {
  let result = -1

  await recordOutput([data], result)
  return result
}

function findBrickMaxes(bricks) {
  return bricks.reduce((max, brick) => {
    return [
      Math.max(max[0], brick[1][0]),
      Math.max(max[1], brick[1][2]),
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
  })
  // debugLog(JSON.stringify(bricks))

  maxes = findBrickMaxes(bricks)
  debugLog(JSON.stringify(maxes))

  let unsettledBricks = _.cloneDeep(bricks)
  let settledBricks = []
  let settledMax = Array(maxes[0]).fill(true).map(_ => Array(maxes[1]).fill(0))
  while (unsettledBricks.length) {
    // seach for lowest unsettledBricks
    const lowestBricks = unsettledBricks.reduce((lowest, brick) => {
      return brick[0][2] < lowest[0][2] ? brick : lowest
    }, unsettledBricks[0])
    // pick it out
    unsettledBricks = unsettledBricks.filter(b => b !== lowestBricks)
    // fall down
    // search for max settledMax within range
    let fallingZ = 0
    for (let x = lowestBricks[0][0]; x <= lowestBricks[1][0]; ++x) {
      for (let y = lowestBricks[0][1]; y <= lowestBricks[1][1]; ++y) {
        fallingZ = Math.max(settledMax[x][y], fallingZ)
      }
    }
    debugLog({fallingZ})
    // TODO: reduce height
    if (fallingZ !== lowestBricks[0][2]) {
      throw new Error('really have to fall!!')
    }
    // add to settle
    settledBricks.push(lowestBricks)
  }

  debugLog(lib.mapToHash(groundStat))

  console.log('====')
  // console.log({sum})

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
