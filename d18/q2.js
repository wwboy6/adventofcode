const fs = require('fs')
const readline = require('readline')
const path = require('path')
const { rFact, compareObject } = require('../lib/lib')

// const inputFilePath = 'input-test.txt'
const inputFilePath = 'input.txt'
const muteFlags = [true, true, true, ]

// async function coreFunction(data) {
//   let result = -1

//   await recordOutput([data], result)
//   return result
// }

function v2AddMul (v0, v1, mul) {
  return { x: v0.x + v1.x * mul, y: v0.y + v1.y * mul }
}

let dirV = {
  'U': { x: 0, y: -1 },
  'D': { x: 0, y: 1 },
  'R': { x: 1, y: 0 },
  'L': { x: -1, y: 0 },
}

async function main () {

  const file = fs.createReadStream(path.resolve(__dirname, inputFilePath))
  const rl = readline.createInterface({
    input: file,
    crlfDelay: Infinity,
  })

  let previuosPoint = {x: 0, y: 0}
  let edgeCount = 0
  let area = 0
  for await (const line of rl) {
    let [, , , color] = line.match(/(.) (.+) \(#(.+)\)/)
    dist =  Number.parseInt(color.slice(0, 5), 16)
    dir = {
      '0': 'R',
      '1': 'D',
      '2': 'L',
      '3': 'U',
    }[color[5]]
    debugLog({dir, dist, color})
    let dirVec = dirV[dir]
    dist = Number.parseInt(dist)
    edgeCount += dist
    let pt = v2AddMul(previuosPoint, dirVec, dist)
    debugLog({pt})
    area += (previuosPoint.x * pt.y - pt.x * previuosPoint.y) / 2
    previuosPoint = pt
  }

  debugLog({ edgeCount, area })

  let answer = area + (edgeCount / 2) + 1

  console.log('====')
  console.log({answer})

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

// module.exports = {
//   coreFunction,
// }
