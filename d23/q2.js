const fs = require('fs')
const readline = require('readline')
const path = require('path')
const lib = require('../lib/lib')
const _ = require('lodash')
const { start } = require('repl')

// const inputFilePath = 'input-test.txt'
const inputFilePath = 'input.txt'
const muteFlags = [true, true, false, ]

const directions = [
  { x: 0, y: -1 },
  { x: 0, y: 1 },
  { x: -1, y: 0 },
  { x: 1, y: 0 },
]

function searchCheckPoint(map, startPos, nextPos, endPos) {
  const path = [ startPos, nextPos ]
  do {
    const nextPs = directions.map(dir => lib.v2Add(nextPos, dir)).filter(p => {
      return lib.getMap(map, p) !== '#' && !path.some(pp => lib.v2IsSame(p, pp))
    })
    if (nextPs.length == 0) return {}
    if (nextPs.length >= 2) {
      // next checkpoint is found
      break
    }
    nextPos = nextPs[0]
    path.push(nextPos)
    if (lib.v2IsSame(nextPos, endPos)) {
      // end pos is found
      break
    }
  } while (true)
  return {
    checkPoint: nextPos,
    path,
  }
}

function compressMap(map, startPos, endPos) {
  const comMap = {}
  const reachedPositions = []
  const checkPoints = [ startPos ]
  while (checkPoints.length) {
    const cp = checkPoints.shift()
    for (let dir of directions) {
      const newPos = lib.v2Add(cp, dir)
      if (
        newPos.y < 0 || // TODO: there is no other edge case
        lib.getMap(map, newPos) === '#' ||
        reachedPositions.some(p => lib.v2IsSame(p, newPos))
      ) continue
      // search for next check point
      const {checkPoint, path} = searchCheckPoint(map, cp, newPos, endPos)
      if (!checkPoint) continue
      // record the path
      const fromHash = lib.v2ToHash(cp)
      const toHash = lib.v2ToHash(checkPoint)
      _.defaults(comMap, {[fromHash]: []}, {[toHash]: []})
      comMap[fromHash].push({
        pos: checkPoint,
        dist: path.length - 1
      })
      comMap[toHash].push({
        pos: cp,
        dist: path.length - 1
      })
      // record first / last pos of path to avoid redundancy
      reachedPositions.push(path[1])
      reachedPositions.push(path[path.length - 2])
      if (!lib.v2IsSame(checkPoint, endPos) && !checkPoints.some(p => lib.v2IsSame(p, checkPoint))) checkPoints.push(checkPoint)
    }
  }
  return comMap
}

function findLongest(map, route, endPos) {
  let routes = [ route ]
  let result = null
  let loop = 0
  while (routes.length) {
    ++loop
    const route = routes.pop()
    if (loop % 1000000 === 0) console.log({loop, len: route.len, max: result ? result.value.dist : 0})
    const newPos = route.value.pos
    // check all dir
    for (let {pos, dist} of map[lib.v2ToHash(newPos)]) {
      if (lib.llFind(route, pos, (r, p) => lib.v2IsSame(r.pos, p))) continue
      const newRoute = lib.llAdd(route, { pos, dist: route.value.dist + dist })
      if (lib.v2IsSame(pos, endPos)) {
        if (result === null || newRoute.value.dist > result.value.dist) result = newRoute
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
  let endPos = {x: mapWidth - 2, y: mapHeight - 1}
  
  // compress map
  const compressedMap = compressMap(map, startPos, endPos)
  // debugLog(JSON.stringify(compressedMap))
  // find longest path
  let route = lib.llAdd(null, { pos: startPos, dist: 0 })
  let result = findLongest(compressedMap, route, endPos)

  console.log('====')
  console.log({result})
  // console.log({len: result.len - 1})
  debugLog(result.value.dist)

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
