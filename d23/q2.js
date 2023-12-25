const fs = require('fs')
const readline = require('readline')
const path = require('path')
const lib = require('../lib/lib')
const _ = require('lodash')

// const inputFilePath = 'input-test.txt'
const inputFilePath = 'input.txt'
const muteFlags = [false, false, false, ]

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
  let routes = [ route ]
  let result = null
  let loop = 0
  while (routes.length) {
    ++loop
    const route = routes.pop()
    if (loop % 10000 === 0) console.log({loop, len: route.len, max: result ? result.len : 0})
    const pos = route.value
    // check all dir
    for (let dir of directions) {
      let newPos = lib.v2Add(pos, dir)
      if (lib.getMap(map, newPos) === '#') continue
      if (newPos.y < 0) continue // TODO: there is no other edge case
      if (lib.llFind(route, newPos, lib.v2IsSame)) continue
      const newRoute = lib.llAdd(route, newPos)
      if (lib.v2IsSame(newPos, tarPos)) {
         // TODO: assume only 1 neigbour of tarPos
        if (result === null || newRoute.len > result.len) result = newRoute
      } else {
        // split route into sub-routes
        routes.push(newRoute)
      }
    }
  }
  return result
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
  // printRoute(map, result)

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
