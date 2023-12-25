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

const directions = [
  { x: 0, y: -1 },
  { x: 0, y: 1 },
  { x: -1, y: 0 },
  { x: 1, y: 0 },
]

function printRoute(map, route) {
  const newMap = _.cloneDeep(map)
  while(route) {
    lib.setMap(newMap, route.value, ''+(route.len % 10))
    route = route.parent
  }
  console.log(lib.mapToHash(newMap))
}

function findLongest(map, route, tarPos) {
  // debugLog1(route.len)
  let max = null
  const pos = route.value
  for (let dir of directions) {
    let newPos = lib.v2Add(pos, dir)
    let newRoute = route
    // resolve symbol
    switch(lib.getMap(map, newPos)) {
      case '^':
        newRoute = lib.llAdd(newRoute, newPos)
        newPos = lib.v2Add(newPos, directions[0])
        break
      case 'v':
        newRoute = lib.llAdd(newRoute, newPos)
        newPos = lib.v2Add(newPos, directions[1])
        break
      case '<':
        newRoute = lib.llAdd(newRoute, newPos)
        newPos = lib.v2Add(newPos, directions[2])
        break
      case '>':
        newRoute = lib.llAdd(newRoute, newPos)
        newPos = lib.v2Add(newPos, directions[3])
        break
      case '#':
        continue
    }
    if (newPos.y < 0) continue // TODO: there is no other edge case
    if (lib.v2IsSame(newPos, tarPos)) {
      return lib.llAdd(newRoute, newPos) // TODO: assume only 1 neigbour of tarPos
    }
    // check is new pos is already reached
    if (lib.llFind(newRoute, newPos, lib.v2IsSame)) continue
    // recurr
    const subMax = findLongest(map, lib.llAdd(newRoute, newPos), tarPos)
    if (subMax) {
      if (!max || subMax.len > max.len) {
        max = subMax
      }
    }
  }
  return max
}

let mapWidth, mapHeight

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
  let map = lines.map(line => line.split(''))
  mapWidth = lines[0].length
  mapHeight = lines.length

  // const lines = fs.readFileSync(process.stdin.fd).toString().replace('\r', '').split("\n");

  // debugLog({lines})
  
  let startPos = {x: 1, y: 0}
  let route = { // linked list
    value: startPos,
    parent: null,
    len: 1
  }
  let result = findLongest(map, route, {x: mapWidth - 2, y: mapHeight - 1})
  console.log({len: result.len - 1})
  printRoute(map, result)

  console.log('====')
  console.log({result})
  console.log({len: result.len - 1})

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
