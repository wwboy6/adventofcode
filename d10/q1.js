const fs = require('fs')
const readline = require('readline');
const path = require('path')

let map = [], mapWidth, mapHeight

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

function findLoopEnd(dm, tracks) {
  let level = 1
  while (true) {
    const newTrack = []
    for (let pos of tracks) {
      // retrieve map status and set it as level
      const status = getMap(pos)
      // console.log({status}) // TODO:
      if (typeof status === 'number') {
        // console.log({ status }) // TODO:
        return status
      }
      setMap(pos, level)
      for (let d of dm[status]) {
        const {pos: np, valid} = applyDirection(pos, d)
        if (!valid) continue
        const ts = getMap(np)
        if (typeof ts === 'number') {
          if (ts >= level) {
            // console.log({ level, ts }) // TODO:
            return ts
          } else continue
        }
        newTrack.push(np)
      }
    }
    tracks = newTrack
    ++level
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
  let start = {x,y}
  console.log({start})
  setMap(start, 0)

  // resolve the first level: the next pos is pointing back to start
  let tracks = directions.map(d => applyDirection(start, d)).filter(value => {
    if (!value.valid) return false
    const nd = value.pos
    const backDirs = dm[getMap(nd)]
    return backDirs.some(bd => {
      const {pos: cp} = applyDirection(nd, bd)
      return isSamePos(cp, start)
    })
  }).map(value => value.pos)
  console.log({tracks})

  const ans = findLoopEnd(dm, tracks)

  console.log('====')
  console.log({ans})

}

main();
