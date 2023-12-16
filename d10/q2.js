const fs = require('fs')
const readline = require('readline');
const path = require('path')
const { compareObject } = require('../lib/lib')

let mapOld = [], map = [], start, mapWidth, mapHeight
let loopMax

function setMap(pos, value) {
  map[pos.y][pos.x] = value
}

function getMap(pos) {
  return map[pos.y][pos.x]
}

function isSamePos(pos0, pos1) {
  return pos0.x === pos1.x && pos0.y === pos1.y
}

function applyDirection(pos, dir) {
  pos = {
    x: pos.x + dir.x,
    y: pos.y + dir.y
  }
  return {
    pos,
    valid: pos.x >=0 && pos.x < mapWidth && pos.y >= 0 && pos.y < mapHeight
  }
}

function findLoopEnd(dm, pos) {
  for (let step = 1; true; ++step) {
    // retrieve map status and set it as level
    const status = getMap(pos)
    // console.log({status}) // TODO:
    setMap(pos, step)

    for (let d of dm[status]) {
      const {pos: np, valid} = applyDirection(pos, d)
      if (!valid) continue
      const ts = getMap(np)
      if (step !== 1 && ts === 0) {
        loopMax = step
        return
      }
      if (typeof ts === 'number') continue
      // console.log('next', np)
      pos = np
      break
    }
    // console.log({level})
  }
}

async function main () {
  // const file = fs.createReadStream(path.resolve(__dirname, 'input-test.txt'))
  const file = fs.createReadStream(path.resolve(__dirname, 'input.txt'))
  const rl = readline.createInterface({
    input: file,
    crlfDelay: Infinity,
  })

  let x = 0, y = 0, ty = 0
  for await (const line of rl) {
    map.push(line.split(''))
    mapOld.push(line.split(''))
    const index = line.indexOf('S')
    if (index >= 0) {
      x = index
      y = ty
    }
    ++ty
  }

  mapWidth = map[0].length
  mapHeight = map.length

  let directions = [ { x: 0, y: 1}, { x: 1, y: 0}, { x: 0, y: -1}, { x: -1, y: 0}, ]
  let dm = {
    '|': [ {x: 0, y: 1}, {x: 0, y: -1} ],
    '-': [ {x: -1, y: 0}, {x: 1, y: 0} ],
    'L': [ {x: 1, y: 0}, {x: 0, y: -1} ],
    'J': [ {x: -1, y: 0}, {x: 0, y: -1} ],
    '7': [ {x: -1, y: 0}, {x: 0, y: 1} ],
    'F': [ {x: 1, y: 0}, {x: 0, y: 1} ],
    '.': [],
  }

  // start at {x, y}
  start = {x,y}
  console.log({start})
  setMap(start, 0)
  // determin start direction
  

  // resolve the first level: the next pos is pointing back to start
  const startDirs = directions.filter(d => {
    const value = applyDirection(start, d)
    if (!value.valid) return false
    const nd = value.pos
    const backDirs = dm[getMap(nd)]
    const valid = backDirs.some(bd => {
      const {pos: cp} = applyDirection(nd, bd)
      return isSamePos(cp, start)
    })
    return valid
  })
  const {pos} = applyDirection(start, startDirs[0])
  console.log({pos})

  // determin start status
  const startStatus = Object.keys(dm).find(status => {
    // return startDirs.every(dir => dm[status].some( dmDir => dir.x === dmDir.x && dir.y === dmDir.y))
    return startDirs.every(dir => dm[status].some( dmDir => compareObject(dir, dmDir)))
  })
  console.log({ startStatus })
  // setMap(start, startStatus)
  mapOld[start.y][start.x] = startStatus

  findLoopEnd(dm, pos)
  console.log({ loopMax })

  let sum = 0
  for (let y = 0; y < mapHeight; ++y) {
    let isInLoop = false
    let previousCorner = ''
    for (let x = 0; x < mapWidth; ++x) {
      let status = mapOld[y][x]
      if (typeof getMap({x, y}) !== 'number') {
        mapOld[y][x] = '.'
        status = '.'
      }
      if (status === '|') {
        isInLoop = !isInLoop
      } else if (status === 'F' || status === 'L') {
        previousCorner = status
      } else if (status === 'J' || status === "7") {
        if (previousCorner === "F" && status == 'J' || previousCorner === 'L' && status === '7') {
          isInLoop = !isInLoop
        }
        previousCorner = ''
      } else if (status === '.') {
        if (isInLoop) {
          mapOld[y][x] = '*'
          ++sum
        }
      }
    }
  }
  // console.log(map.map(line => line.map(c => (`${c}|`).padStart(4, ' ')).join('')).join('\n'))
  // console.log(mapOld.map(line => line.map(c => (`${c}|`).padStart(4, ' ')).join('')).join('\n'))

  console.log('====')
  // console.log({ans})
  console.log({sum})

}

main();
