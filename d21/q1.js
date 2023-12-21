const fs = require('fs')
const readline = require('readline')
const path = require('path')
const lib = require('../lib/lib')
const _ = require('lodash')

// const inputFilePath = 'input-test.txt'
const inputFilePath = 'input.txt'
const muteFlags = [true, false, false, ]

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

function prcocessOneStep(map) {
  const newMap = map.map(line => line.map(c => {
    return c === 'O' ? '.' : c
  }))
  const mapWidth = map[0].length;
  const mapHeight = map.length;

  for (let y = 0; y < mapHeight; ++y) {
    for (let x = 0; x < mapWidth; ++x) {
      const pos = {x, y}
      if (lib.getMap(map, pos) === '#') continue
      // if (lib.getMap(map, {x, y}) === 'O')
      if (directions.some(dir => {
        const newPos = lib.v2Add(pos, dir)
        return lib.getMap(map, newPos) === 'O'
      })) {
        lib.setMap(newMap, pos, 'O') 
      }
    }
  }
  return newMap
}

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

  const lines = dataStr.split("\n");
  let map = lines.map(line => line.replace('S', 'O').split(''))
  debugLog({map})

  // let pos
  // for (let y = 0; y < lines.length; ++y) {
  //   const x = lines[y].indexOf('S')
  //   if (x >= 0) {
  //     pos = {x, y}
  //     break
  //   }
  // }
  // debugLog({ pos })

  for (let i = 0; i < 64; ++i) {
    map = prcocessOneStep(map)
  }
  debugLog(lib.mapToHash(map))

  let sum = map.reduce((sum, line) => {
    return sum + line.filter(c => c === 'O').length
  }, 0)

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
