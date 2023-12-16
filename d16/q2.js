const fs = require('node:fs')
const readline = require('node:readline')
const path = require('path')
// const _ = require('loadash')

function mapToHash(map) {
  return map.map(line => line.join('')).join('\n')
}

function getMap(map, pos) {
  return map[pos.y][pos.x]
}

function setMap(map, pos, value) {
  map[pos.y][pos.x] = value
}

function v2Add (v0, v1) {
  return { x: v0.x + v1.x, y: v0.y + v1.y }
}

function beanToHash(bean) {
  return `${bean.pos.x},${bean.pos.y}|${bean.dir.x},${bean.dir.y}`
}

function enlight(map, beans) {
  const resolvedBean = {}
  const mapWidth = map[0].length
  const mapHeight = map.length
  const enlightedMap = map.map(line => line.map(() => '.'))
  while (beans.length) {
    let newBeans = []
    for (let bean of beans) {
      const hash = beanToHash(bean)
      if (resolvedBean[hash]) continue
      resolvedBean[hash] = true
      let nextDir = {...bean.dir}
      let nextPos = v2Add(bean.pos, bean.dir)
      // ignore bean that going out
      if (nextPos.x < 0 || nextPos.y < 0 || nextPos.x >= mapWidth || nextPos.y >= mapHeight) continue
      let newBeans2 = []
      switch(getMap(map, nextPos)) {
        case '|':
          if (nextDir.x === 0) break
          // split into 2 beans
          newBeans2.push({
            pos: nextPos,
            dir: { x: 0, y: -1}
          })
          newBeans2.push({
            pos: nextPos,
            dir: { x: 0, y: 1}
          })
          break
        case '-':
          if (nextDir.y === 0) break
          // split into 2 beans
          newBeans2.push({
            pos: nextPos,
            dir: { x: -1, y: 0}
          })
          newBeans2.push({
            pos: nextPos,
            dir: { x: 1, y: 0}
          })
          break
        case '\\':
          newBeans2.push({
            pos: nextPos,
            dir: { x: nextDir.y, y: nextDir.x}
          })
          break
        case '/':
          newBeans2.push({
            pos: nextPos,
            dir: { x: -nextDir.y, y: -nextDir.x}
          })
          break
        default:
          // enlight
          // setMap(map, nextPos, '#')
          break
      }
      // bean just go normally
      if (!newBeans2.length) {
        newBeans2.push({
          pos: nextPos,
          dir: {...nextDir},
        })
      }
      newBeans = [...newBeans, ...newBeans2]
      setMap(enlightedMap, nextPos, '#')
    }
    // console.log('newBeans', newBeans.length)
    beans = newBeans
  }
  return enlightedMap
}

async function main() {
  // const file = fs.createReadStream(path.resolve(__dirname, 'input-test.txt'))
  const file = fs.createReadStream(path.resolve(__dirname, 'input.txt'))
  const rl = readline.createInterface({
    input: file,
    culfDelay: Infinity, 
  })

  let map = []
  for await (const line of rl) {
    map.push(line.split(''))
  }
  // console.log({ map })

  const mapWidth = map[0].length
  const mapHeight = map.length
  let max = 0;
  // left / right
  for (let y = 0; y < mapHeight; ++y) {
    console.log({y})
    let beams = [{ pos: {x:-1, y}, dir: {x: 1, y: 0} }]
    let enlightedMap = enlight(map, beams)
    let count = enlightedMap.reduce((sum, line) => { return sum + line.filter(c => c === '#').length }, 0)
    max = Math.max(max, count)
    beams = [{ pos: {x: mapWidth, y}, dir: {x: -1, y: 0} }]
    enlightedMap = enlight(map, beams)
    count = enlightedMap.reduce((sum, line) => { return sum + line.filter(c => c === '#').length }, 0)
    max = Math.max(max, count)
  }
  // top bottom
  for (let x = 0; x < mapWidth; ++x) {
    console.log({x})
    let beams = [{ pos: {x, y: -1}, dir: {x: 0, y: 1} }]
    let enlightedMap = enlight(map, beams)
    let count = enlightedMap.reduce((sum, line) => { return sum + line.filter(c => c === '#').length }, 0)
    max = Math.max(max, count)
    beams = [{ pos: {x, y: mapHeight}, dir: {x: 0, y: -1} }]
    enlightedMap = enlight(map, beams)
    count = enlightedMap.reduce((sum, line) => { return sum + line.filter(c => c === '#').length }, 0)
    max = Math.max(max, count)
  }

  // console.log(mapToHash(enlightedMap))

  console.log('=====')
  // console.log({ sum })
  console.log({ max })
}

main()