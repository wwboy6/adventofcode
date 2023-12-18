const fs = require('fs')
const readline = require('readline')
const path = require('path')
const { rFact, compareObject } = require('../lib/lib')
const _ = require('lodash')

// const inputFilePath = 'input-test.txt'
const inputFilePath = 'input.txt'
const muteFlags = [true, true, true, ]

async function coreFunction(data) {
  let result = -1

  await recordOutput([data], result)
  return result
}

function getMap(map, pos) {
  const row = map[pos.y]
  if (!row) return
  return row[pos.x]
}

function setMap(map, pos, value) {
  map[pos.y][pos.x] = value
}

function mapToHash(map) {
  return map.map(line => line.join('')).join('\n')
}

function v2Add (v0, v1) {
  return { x: v0.x + v1.x, y: v0.y + v1.y }
}

function v2IsSame (v0, v1) {
  return v0.x === v1.x && v0.y === v1.y
}

function isStrictlyBetterData(d0, d1, isDestination) {
  if (isDestination) return d0.cost <= d1.cost
  return d0.fromAxis === d1.fromAxis && d0.fromSign === d1.fromSign && d0.fromMagnitue <= d1.fromMagnitue && d0.cost <= d1.cost
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
  
  let map = dataStr.split('\n').map(line => line.split('').map(c => Number.parseInt(c)))
  const mapWidth = map[0].length
  const mapHeight = map.length
  let data = map.map((line, y) => line.map((m, x) => { return [] }))
  let startD = { pos: { x: 0, y: 0 }, cost: 0, fromAxis: 'N/A', fromMagnitue: 0 }
  let positions = [ startD ]
  setMap(data, {x:0, y:0}, [startD])

  let result
  while (positions.length) {
    const tarData = positions.shift()
    // debugLog({ pos: positions.length, cost: tarData.cost })
    // debugLog({tarData})
    for (let axis of ['x', 'y']) {
      for (let sign of [1, -1]) {
        const sameDir = tarData.fromAxis === axis
        // cannot process for counter dir
        if (sameDir && tarData.fromSign != sign) continue
        // check straight run limit
        if (sameDir && tarData.fromMagnitue === 10) continue

        //
        let cost = tarData.cost
        
        const vector = { x: 0, y: 0 }
        const mag = sameDir ? 1 : 4
        vector[axis] = sign
        let valid = true
        let newPos = tarData.pos
        for (let i = 0; i < mag; ++i) {
          newPos = v2Add(newPos, vector)
          let mm = getMap(map, newPos)
          // check if out of map
          if (!mm) {
            valid = false
            break
          }
          cost += mm
        }
        if (!valid) continue

        //
        const newData = {
          pos: newPos,
          cost,
          // fromDir: { ...vector },
          fromAxis: axis,
          fromSign: sign,
          fromMagnitue: sameDir ? tarData.fromMagnitue + 1 : 4,
          fromData: tarData // TODO:
        }

        const isDestination = newPos.x === mapWidth - 1 && newPos.y === mapHeight - 1
        
        // check
        let checkDatas = getMap(data, newPos)
        //
        let hasStrictlyBetter = checkDatas.some(d => isStrictlyBetterData(d, newData))
        if (hasStrictlyBetter) continue
        // and check if any data is strictly worst that it
        let strictlyWorstOldDatas = checkDatas.filter(d => isStrictlyBetterData(newData, d))
        if (strictlyWorstOldDatas.length) {
          checkDatas = checkDatas.filter(d => !strictlyWorstOldDatas.includes(d))
          setMap(data, newPos, checkDatas)
          positions = positions.filter(d => !strictlyWorstOldDatas.includes(d))
        }
        checkDatas.push(newData)

        //
        if (isDestination && mag === 1) {
          // debugLog({ tarData, newData })
          // result = newData
          const lowestCost = checkDatas.map(d => d.cost).sort((a, b) => a-b)[0]
          result = checkDatas.find(d => d.cost === lowestCost)
          break
        }

        // positions.push(newData)
        const sortedIndex = _.sortedIndexBy(positions, newData, d => d.cost)
        // debugLog({ sortedIndex })
        positions = [...positions.slice(0, sortedIndex), newData, ...positions.slice(sortedIndex)]
      }

      if (result) break
    }

    if (result) break
  }

  //
  // let pos = { x: mapWidth - 1, y: mapHeight - 1 }

  // // back trace
  // let tarData = result
  // while (tarData) {
  //   switch(tarData.fromAxis){
  //     case 'x':
  //       switch(tarData.fromSign) {
  //         case 1:
  //           setMap(map, tarData.pos, '>')
  //           break
  //         case -1:
  //           setMap(map, tarData.pos, '<')
  //           break
  //       }
  //       break
  //     case 'y':
  //       switch(tarData.fromSign) {
  //         case 1:
  //           setMap(map, tarData.pos, 'v')
  //           break
  //         case -1:
  //           setMap(map, tarData.pos, '^')
  //           break
  //       }
  //       break
  //   }
  //   tarData = tarData.fromData
  //   // debugLog({ tarData })
  // }
  // debugLog(mapToHash(map))

  console.log('====')
  console.log(result.cost)

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
